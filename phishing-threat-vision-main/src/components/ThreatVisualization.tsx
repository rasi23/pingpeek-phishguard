
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchThreatTimeSeriesData, fetchAttackPatterns, fetchDomainAnalysis } from "@/services/api";
import { ChartBarIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

export function ThreatVisualization() {
  // Fetch data using React Query
  const { 
    data: timeSeriesData, 
    isLoading: isLoadingTimeSeries 
  } = useQuery({
    queryKey: ['threatTimeSeries'],
    queryFn: fetchThreatTimeSeriesData
  });
  
  const { 
    data: attackPatterns, 
    isLoading: isLoadingAttackPatterns 
  } = useQuery({
    queryKey: ['attackPatterns'],
    queryFn: fetchAttackPatterns
  });
  
  const { 
    data: domainAnalysis, 
    isLoading: isLoadingDomainAnalysis 
  } = useQuery({
    queryKey: ['domainAnalysis'],
    queryFn: fetchDomainAnalysis
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Time Series Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChartIcon className="w-5 h-5" />
              Phishing Attempts Over Time
            </CardTitle>
            <CardDescription>
              Trend analysis of email classifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoadingTimeSeries ? (
                <div className="flex h-full items-center justify-center">Loading chart data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeriesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: 'rgba(0, 0, 0, 0)', color: '#fff' }} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="phishing" 
                      name="Phishing" 
                      stackId="1" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      fillOpacity={0.6} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="suspicious" 
                      name="Suspicious" 
                      stackId="1" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      fillOpacity={0.6} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="legitimate" 
                      name="Legitimate" 
                      stackId="1" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attack Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Common Attack Patterns
            </CardTitle>
            <CardDescription>
              Types of phishing attacks detected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoadingAttackPatterns ? (
                <div className="flex h-full items-center justify-center">Loading chart data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attackPatterns}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} />
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: 'rgba(0, 0, 0, 0)', color: '#fff' }} />
                    <Bar dataKey="count" name="Count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Domain Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Malicious Domain Analysis
            </CardTitle>
            <CardDescription>
              Top domains used in phishing attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoadingDomainAnalysis ? (
                <div className="flex h-full items-center justify-center">Loading chart data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={domainAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="domain"
                      label={({ domain, percent }) => `${domain}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {domainAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `Count: ${value}`,
                        `Threat Level: ${props.payload.threatLevel}%`
                      ]}
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: 'rgba(0, 0, 0, 0)', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
