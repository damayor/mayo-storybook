import type { DmColor, DmTheme } from "../../../interfaces/story-variants";

export interface BadgeProps {

  color?: DmColor
  theme?: DmTheme
  label?: string;
}

export const Badge = ({
  color = 'primary',
  label = 'olakeace',
  theme = 'onlight',
  ...props
}: BadgeProps) => {

  const getBadgeColor = ()  => {
    if(theme == 'ondark' && color == 'neutral') //Fixealo para que salga transparente, no fondo negro
    {
      return 'badge-neutral badge-outline text-white'
    }
    else
    {
      return `badge-${color}`
    }
  }


  return (
    <div>
      {/* <div className={`badge-lg padding-x-10px badge badge-${color} rounded-sm`}>{label}</div> */}
      <div className={`w-32 h-10 font-montserrat badge rounded-sm border-1 border-gray-700 ${getBadgeColor()}  hover:border-gray-50 `}>{label}</div>
    </div>

  );
};
