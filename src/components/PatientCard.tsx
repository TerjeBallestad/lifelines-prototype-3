import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import type { Patient } from '../models/Patient';

interface PatientCardProps {
  patient: Patient;
}

// MTG color to Tailwind border color mapping
const colorToBorder: Record<string, string> = {
  white: 'border-l-amber-100',
  blue: 'border-l-blue-500',
  black: 'border-l-gray-800',
  red: 'border-l-red-500',
  green: 'border-l-green-500',
};

// Energy status to progress bar color mapping
const statusToProgress: Record<string, string> = {
  high: 'progress-success',
  medium: 'progress-warning',
  low: 'progress-error',
};

export const PatientCard = observer(function PatientCard({ patient }: PatientCardProps) {
  const borderColor = colorToBorder[patient.primaryColor] || 'border-l-gray-500';
  const progressColor = statusToProgress[patient.energyStatus];

  return (
    <div
      className={clsx(
        'card bg-base-200 shadow-lg border-l-4',
        borderColor
      )}
    >
      <div className="card-body p-4">
        {/* Patient name */}
        <h3 className="card-title text-lg font-bold">
          {patient.name}
        </h3>

        {/* Energy display */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-base-content/70">Energy</span>
            <span className="font-semibold text-base-content">
              {patient.energy}/{patient.maxEnergy}
            </span>
          </div>
          <progress
            className={clsx('progress w-full', progressColor)}
            value={patient.energyPercent}
            max="100"
          />
        </div>
      </div>
    </div>
  );
});
