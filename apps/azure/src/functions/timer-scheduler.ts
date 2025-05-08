import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  Timer,
} from '@azure/functions';
import * as cronParser from 'cron-parser';

// In-memory job store for demo only. Use persistent storage in production!

let scheduleTime = '0 */1 * * * *';

let lastRun: string | null = null; // Tracks the last run time

// HTTP trigger to schedule a recurring backend call
export async function scheduleJob(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { schedule } = (await request.json()) as {
      schedule: string;
    };
    if (!schedule) {
      return { status: 400, jsonBody: { error: 'Missing schedule or url' } };
    }

    scheduleTime = schedule; // Update the global schedule

    const url = 'http://localhost:3300/api/admin/test'; // Replace with your backend URL
    context.log(`Scheduled job with cron "${schedule}" to call ${url}`);
    return { status: 200, jsonBody: { message: 'Recurring job scheduled' } };
  } catch (error) {
    context.error('Failed to schedule job', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Timer trigger checks every minute for jobs to run
export async function timerTrigger(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  const now = new Date();
  context.log(`Timer trigger function executed at ${now}`);
  try {
    const interval = cronParser.parseExpression(scheduleTime, {
      currentDate: now,
    });
    const prev = interval.prev();
    // If the previous scheduled time is within the last minute, trigger
    if (!lastRun || new Date(lastRun) < prev.toDate()) {
      const url = 'http://localhost:3300/api/admin/test'; // Replace with your backend URL
      context.log(
        `Triggering backend service at ${url} (cron: ${scheduleTime})`
      );
      try {
        await fetch(url, { method: 'POST' });
        context.log(`Successfully triggered ${url}`);
        lastRun = prev.toISOString();
      } catch (err) {
        context.error(`Failed to trigger ${url}`, err);
      }
    }
  } catch (err) {
    context.error(`Invalid cron schedule: ${scheduleTime}`, err);
  }
}

app.http('scheduleJob', {
  methods: ['POST'],
  authLevel: 'function',
  handler: scheduleJob,
});

app.timer('timerTrigger', {
  schedule: scheduleTime, // Default to every minute if no jobs are scheduled
  handler: timerTrigger,
});
