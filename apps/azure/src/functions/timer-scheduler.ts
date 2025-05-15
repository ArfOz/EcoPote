/* eslint-disable @nx/enforce-module-boundaries */
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  Timer,
} from '@azure/functions';
import * as cronParser from 'cron-parser';

import { CronTimeSetEnum } from '../dtos'; // Import the enum

let scheduleTime: CronTimeSetEnum = CronTimeSetEnum['every-minute']; // Use enum for type safety
let startTime: string | null = null;
let lastRun: string | null = null;
let isActive = true; // Track if the cron is active

// HTTP trigger to update the schedule time, start time, or status
export async function scheduleJob(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { schedule, start, status } = (await request.json()) as {
      schedule?: string;
      start?: string;
      status?: boolean; // Changed from 'start' | 'stop' to boolean
    };

    console.log('Received request to update schedule:', {
      schedule,
      start,
      status,
    });

    if (typeof status === 'boolean') {
      isActive = status;
      context.log(
        `Cron job status set to: ${isActive ? 'active' : 'inactive'}`
      );
    }

    if (schedule) {
      // Convert enum key (string) to value
      if (
        typeof schedule === 'string' &&
        CronTimeSetEnum[schedule as keyof typeof CronTimeSetEnum]
      ) {
        scheduleTime =
          CronTimeSetEnum[schedule as keyof typeof CronTimeSetEnum];
        context.log(`Schedule updated to "${scheduleTime}"`);
      } else {
        context.error(`Invalid schedule key: ${schedule}`);
        return { status: 400, jsonBody: { error: 'Invalid schedule key' } };
      }
    }
    if (start) {
      startTime = start;
      context.log(`Start time updated to "${startTime}"`);
    }

    return {
      status: 200,
      jsonBody: {
        message: `Cron job ${
          isActive ? 'started' : 'stopped'
        }. Schedule: ${scheduleTime}, Start time: ${startTime}`,
      },
    };
  } catch (error) {
    context.error('Failed to update schedule', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Timer trigger runs on the current scheduleTime (read at startup)
export async function timerTrigger(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  if (!isActive) {
    context.log('Cron job is inactive. Skipping execution.');
    return;
  }

  const now = new Date();

  const token = process.env.STATIC_TOKEN; //

  const url: string = process.env.EMAIL_BACKEND_URL!;
  context.log(`Timer trigger function executed at ${now.toISOString()}`);
  try {
    // If startTime is set and now is before startTime, do nothing
    if (startTime && now < new Date(startTime)) {
      context.log(
        `Current time is before startTime (${startTime}), skipping trigger.`
      );
      return;
    }
    const interval = cronParser.parseExpression(scheduleTime, {
      currentDate: now,
    });
    const prev = interval.prev();
    // If the previous scheduled time is within the last minute, trigger
    if (!lastRun || new Date(lastRun) < prev.toDate()) {
      // const url = 'http://localhost:3300/api/email/automatedemail'; // Replace with your backend URL
      context.log(
        `Triggering backend service at ${url} (cron: ${scheduleTime}, startTime: ${startTime})`
      );
      try {
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
  schedule: scheduleTime, // This value is only read at startup!
  handler: timerTrigger,
});
