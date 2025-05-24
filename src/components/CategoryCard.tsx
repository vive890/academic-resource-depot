
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count?: number;
}

const CategoryCard = ({ title, description, icon: Icon, count }: CategoryCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
        {count !== undefined && (
          <p className="text-sm text-blue-600 font-medium">{count} resources</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
