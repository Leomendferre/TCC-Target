import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check, Trash } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface TargetLisProps {
  date: Date;
  onCompletedChanged: (completed: number) => void
}

interface TargetsInfo {
  possibleTargets: {
    id: string;
    title: string;
    created_at: string;
  }[],
  completedTargets: string[]
}

export function TargetsList({ date, onCompletedChanged }: TargetLisProps) {
  const [targetsInfo, setTargetsInfo] = useState<TargetsInfo>()

  useEffect(() => {
    const userId = localStorage.getItem('userId');
  
    api.get('day', {
      params: {
        date: date.toISOString(),
        user_id: userId
      }
    }).then(response => {
      setTargetsInfo(response.data)
    })
  }, [])

  async function handleToggleTarget(targetId: string) {
    await api.patch(`/targets/${targetId}/toggle`)

    const isTargetAlreadyCompleted = targetsInfo!.completedTargets.includes(targetId)

    let completedTargets: string[] = []
    
    if (isTargetAlreadyCompleted){
      completedTargets = targetsInfo!.completedTargets.filter(id => id !== targetId)
    } else {
      completedTargets = [...targetsInfo!.completedTargets, targetId]
    }

    setTargetsInfo({
      possibleTargets: targetsInfo!.possibleTargets,
      completedTargets,
    })

    onCompletedChanged(completedTargets.length)
  }

  async function handleDeleteTarget(targetId: string) {
    await api.delete(`/targets/${targetId}/delete`);

    const newPossibleTargets = targetsInfo!.possibleTargets.filter(target => target.id !== targetId);
    const newCompletedTargets = targetsInfo!.completedTargets.filter(id => id !== targetId);

    setTargetsInfo({
      possibleTargets: newPossibleTargets,
      completedTargets: newCompletedTargets,
    });

    onCompletedChanged(newCompletedTargets.length);
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {targetsInfo?.possibleTargets.map(target => {
        return (
          <div key={target.id} className="flex items-center gap-3 group">
            <Checkbox.Root
              onCheckedChange={() => handleToggleTarget(target.id)}
              checked={targetsInfo.completedTargets.includes(target.id)}
              disabled={isDateInPast}
              className='flex items-center gap-3 group'
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-blue-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                {target.title}
              </span>
            </Checkbox.Root>
            <button onClick={() => handleDeleteTarget(target.id)} className="text-red-500 hover:text-red-700">
              <Trash size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}