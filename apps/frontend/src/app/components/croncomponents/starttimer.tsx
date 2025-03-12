import React from 'react'
import { ResponseCron } from '@shared/dtos'


export const CronJobStartTime = ({
    cronJob,
    setEditingStartTime,
    originalStartTimeRef,
    editingStartTime,
    handleStartTimeChange,
    handleSave,
    handleDiscard,
}: {
    cronJob: ResponseCron["data"][0];
    setEditingStartTime: React.Dispatch<React.SetStateAction<number | null>>;
    originalStartTimeRef: React.MutableRefObject<{ [key: string]: Date }>;
    editingStartTime: number | null;
    handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSave: (id: number) => void;
    handleDiscard: (id: number) => void;
}) => {
    return (
        <td className="py-2 px-4 border-b relative">
            <input
                type="datetime-local"
                className="ml-2 px-2 py-1 bg-gray-200 rounded z-10 datetime-input"
                value={cronJob.startTime ? new Date(cronJob.startTime).toISOString().substring(0, 16) : ''}
                onFocus={() => {
                    setEditingStartTime(cronJob.id);
                    originalStartTimeRef.current[cronJob.id] = new Date(cronJob.startTime); // Store original start time       
                }}
                onChange={(e) => handleStartTimeChange(e, cronJob.id)}
            />
            {editingStartTime === cronJob.id && (
                <div className="flex space-x-2 mt-2 z-0">
                    <button
                        className="px-2 py-1 bg-green-500 text-white rounded"
                        onClick={() => {
                            handleSave(cronJob.id);
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                            handleDiscard(cronJob.id);
                        }}
                    >
                        Discard
                    </button>
                </div>
            )}
        </td>
    )
}
