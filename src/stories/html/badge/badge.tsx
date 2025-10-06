
export interface BadgeProps {

  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' |'warning' | 'error';
  label?: string;
  onClick?: () => void;
}

export const Badge = ({
  color = 'primary',
  label = 'olakeace',
  ...props
}: BadgeProps) => {
  return (
    <div>
      {/* <div className={`badge-lg padding-x-10px badge badge-${color} rounded-sm`}>{label}</div> */}
      <div className={`w-32 h-10 font-montserrat badge badge-${color} rounded-sm border-1 border-gray-700 hover:border-gray-50 `}>{label}</div>
    </div>

  );
};
