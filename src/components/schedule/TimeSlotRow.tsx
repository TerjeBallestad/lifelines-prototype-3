import { observer } from 'mobx-react-lite';
import { ScheduleCell } from './ScheduleCell';
import type { TimeSlot } from '../../models/types';
import type { Patient } from '../../models/Patient';

interface TimeSlotRowProps {
  timeSlot: TimeSlot;
  patients: Patient[];
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export const TimeSlotRow = observer(function TimeSlotRow({
  timeSlot,
  patients,
}: TimeSlotRowProps) {
  return (
    <>
      <div className="flex items-center justify-center font-medium text-base-content/70">
        {timeSlotLabels[timeSlot]}
      </div>
      {patients.map((patient) => (
        <ScheduleCell
          key={`${patient.id}-${timeSlot}`}
          patientId={patient.id}
          timeSlot={timeSlot}
        />
      ))}
    </>
  );
});
