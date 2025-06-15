'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  color: string;
  index: number;
}

export function StatsCard({ title, value = 0, icon: Icon, color, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-xl transition-shadow duration-300 rounded-2xl card-hover bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-em-navy tracking-wide">
            {title}
          </CardTitle>
          <div className={`p-3 rounded-xl shadow ${color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-3xl font-extrabold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            <CountUpAnimation value={value} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CountUpAnimation({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {(value || 0).toLocaleString()}
    </motion.span>
  );
}