'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, TrendingUp, Bell, Search, Calendar, BarChart3 } from 'lucide-react';

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative w-full max-w-4xl mx-auto perspective-1000"
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl" />
        
        {/* Main dashboard container */}
        <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-background/50 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                jambi-school.vercel.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-16 bg-muted/30 border-r border-border/50 p-2 hidden sm:block">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <nav className="space-y-2">
                {[BarChart3, Users, Calendar, DollarSign].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-lg font-semibold">Dashboard</h2>
                  <p className="text-xs text-muted-foreground">Welcome back, Admin</p>
                </motion.div>
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center relative"
                  >
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card" />
                  </motion.div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatCard
                  icon={<Users className="w-4 h-4" />}
                  label="Students"
                  value="1,234"
                  change="+12%"
                  color="text-blue-500"
                  bgColor="bg-blue-500/10"
                  delay={0.5}
                />
                <StatCard
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Classes"
                  value="48"
                  change="+3"
                  color="text-green-500"
                  bgColor="bg-green-500/10"
                  delay={0.6}
                />
                <StatCard
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Revenue"
                  value="$42.5K"
                  change="+8%"
                  color="text-yellow-500"
                  bgColor="bg-yellow-500/10"
                  delay={0.7}
                />
                <StatCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Attendance"
                  value="94.2%"
                  change="+2.1%"
                  color="text-purple-500"
                  bgColor="bg-purple-500/10"
                  delay={0.8}
                />
              </div>

              {/* Charts area */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Main chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="sm:col-span-2 bg-muted/30 rounded-xl p-4 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Enrollment Trends</span>
                    <span className="text-xs text-muted-foreground">Last 6 months</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Activity feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-muted/30 rounded-xl p-4 border border-border/50"
                >
                  <span className="text-sm font-medium">Recent Activity</span>
                  <div className="mt-3 space-y-3">
                    {[
                      { text: 'New student enrolled', time: '2m ago' },
                      { text: 'Fee payment received', time: '15m ago' },
                      { text: 'Report generated', time: '1h ago' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-xs">{item.text}</p>
                          <p className="text-[10px] text-muted-foreground">{item.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color,
  bgColor,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-muted/30 rounded-xl p-3 border border-border/50 cursor-pointer"
    >
      <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center mb-2 ${color}`}>
        {icon}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        <p className="text-lg font-bold">{value}</p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <span className="text-[10px] text-green-500">{change}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
