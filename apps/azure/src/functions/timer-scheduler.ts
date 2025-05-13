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

let scheduleTime = '*/1 * * * *'; // Default: every minute
let startTime: string | null = null; // ISO string, e.g. "2025-05-10T12:00:00Z"
let lastRun: string | null = null; // Tracks the last run time

// HTTP trigger to update the schedule time and start time
export async function scheduleJob(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { schedule, start } = (await request.json()) as {
      schedule: CronTimeSetEnum;
      start?: string;
    };

    console.log('Received schedule:', schedule);
    if (!schedule) {
      return { status: 400, jsonBody: { error: 'Missing schedule' } };
    }
    scheduleTime = schedule;
    startTime = start || null;
    context.log(
      `Schedule updated to "${scheduleTime}" with startTime "${startTime}"`
    );
    return {
      status: 200,
      jsonBody: {
        message:
          'Schedule and start time updated. Please restart the function app for changes to take effect.',
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
