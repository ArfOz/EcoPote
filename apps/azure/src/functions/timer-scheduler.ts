/* eslint-disable @nx/enforce-module-boundaries */
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  Timer,
} from '@azure/functions';
import * as cronParser from 'cron-parser';

let cronTime = '*/1 * * * *'; // Default cron time (every minute)
let isActive = false; // Track if the cron is active
let defaultStartTime: Date | null = null; // Track when to start running jobs

// HTTP trigger to update the cron time, status, or startTime
export async function scheduleJob(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // --- AUTH CHECK START ---
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.STATIC_TOKEN_CRON_TRIGGER;
  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ') ||
    authHeader.split(' ')[1] !== expectedToken
  ) {
    return {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        error: 'Unauthorized',
        message:
          'Invalid or missing authorization token. Please provide a valid Bearer token in the Authorization header.',
        code: 'AUTH_ERROR',
      },
    };
  }

  try {
    const { status, newCron, startTime } = (await request.json()) as {
      status?: boolean;
      newCron?: string;
      startTime?: string; // ISO string
    };

    context.log(
      `Received request to update cron job. Status: ${status}, New Cron: ${newCron}, New StartTime: ${startTime}`
    );

    if (typeof status === 'boolean') {
      isActive = status;
      context.log(
        `Cron job status set to: ${isActive ? 'active' : 'inactive'}`
      );
    }

    if (newCron) {
      cronTime = newCron;
      context.log(`Cron time updated to "${cronTime}"`);
    }

    if (startTime) {
      defaultStartTime = new Date(startTime);
      context.log(`Start time updated to "${defaultStartTime.toISOString()}"`);
    }

    return {
      status: 200,
      jsonBody: {
        message: `Cron job ${
          isActive ? 'started' : 'stopped'
        }. Cron time: ${cronTime}. Start time: ${
          defaultStartTime?.toISOString() ?? 'not set'
        }`,
      },
    };
  } catch (error) {
    context.error('Failed to update cron job', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Timer trigger runs on a fixed schedule, but checks cronTime, isActive, and startTime
export async function timerTrigger(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  if (!isActive) {
    context.log('Cron job is inactive. Skipping execution.');
    return;
  }

  const now = new Date();

  // Check if startTime is set and now is before startTime
  if (defaultStartTime && now < defaultStartTime) {
    context.log(
      `Current time (${now.toISOString()}) is before startTime (${defaultStartTime.toISOString()}). Skipping execution.`
    );
    return;
  }

  const token = process.env.STATIC_TOKEN;
  const url: string = process.env.EMAIL_BACKEND_URL!;

  context.log(`Timer trigger function executed at ${now.toISOString()}`);

  // Check if now matches cronTime
  try {
    const interval = cronParser.parseExpression(cronTime, { currentDate: now });
    const prev = interval.prev();
    // If the previous run is within the last minute, trigger the job
    if (now.getTime() - prev.getTime() < 60000) {
      context.log(`Triggering backend service at ${url} (cron: ${cronTime})`);
      if (!token) {
        throw new Error(
          'AUTH_TOKEN is not defined in the environment variables'
        );
      }
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      context.log(`Successfully triggered ${url}`);
    } else {
      context.log(`Not time to run job (cron: ${cronTime})`);
    }
  } catch (err) {
    context.error(`Failed to parse cronTime or trigger job: ${err}`);
  }
}

app.http('scheduleJob', {
  methods: ['POST'],
  authLevel: 'function',
  handler: scheduleJob,
});

// Always run every minute, check cronTime logic inside timerTrigger
app.timer('timerTrigger', {
  schedule: cronTime,
  handler: timerTrigger,
});
