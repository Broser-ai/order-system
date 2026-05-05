import Link from "next/link";

interface PathCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  badge?: string;
}

export default function PathCard({ title, description, href, icon, color, badge }: PathCardProps) {
  return (
    <Link href={href} className="group block">
      <div className={`relative bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/20`}>
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl mb-3 ${color}`}>
          {icon}
        </div>
        {badge && (
          <span className="absolute top-4 right-4 text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
            {badge}
          </span>
        )}
        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
