/* eslint-disable react/no-array-index-key */
import {
  Users,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/LayoutProfessor";

export default function ProfessorDashboard() {
  const stats = [
    {
      title: "Turmas Ativas",
      value: "4",
      icon: Users,
      color: "bg-primary-green",
    },
    {
      title: "Total de Alunos",
      value: "87",
      icon: TrendingUp,
      color: "bg-primary-blue",
    },
    {
      title: "Aulas Hoje",
      value: "3",
      icon: Calendar,
      color: "bg-purple",
    },
    {
      title: "Frequência Média",
      value: "92%",
      icon: ClipboardCheck,
      color: "bg-secondary-green",
    },
  ];

  const todayClasses = [
    {
      sport: "Futebol II",
      time: "16:00 - 17:30",
      students: 25,
      location: "Campo Principal",
    },
    {
      sport: "Volei I",
      time: "18:00 - 19:30",
      students: 18,
      location: "Quadra Coberta",
    },
    {
      sport: "Volei 4",
      time: "19:30 - 21:00",
      students: 22,
      location: "Quadra Coberta",
    },
  ];

  const recentActivities = [
    {
      action: "Frequência registrada",
      class: "Futebol II",
      time: "2 horas atrás",
    },
    {
      action: "Novo aluno matriculado",
      class: "Volei I",
      time: "1 dia atrás",
    },
    {
      action: "Frequência registrada",
      class: "Volei 4",
      time: "2 dias atrás",
    },
  ];

  return (
    <Layout
      title="Dashboard do Professor"
      description="Visão geral das suas atividades esportivas"
      rollback={false}
      SidebarComponent={() => null}
    >
      <div className="mt-4 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 px-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="min-h-[100px] sm:min-h-[120px]">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900 sm:text-3xl">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`rounded-full p-2 sm:p-3 ${stat.color} ml-2 flex-shrink-0`}
                  >
                    <stat.icon className="h-4 w-4 text-white-default sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 px-2 sm:gap-6 sm:px-0 xl:grid-cols-2">
          {/* Today's Classes */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Calendar className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Aulas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {todayClasses.map((class_, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-3 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 sm:text-base">
                        {class_.sport}
                      </h4>
                      <div className="mt-1 flex items-center text-xs text-gray-600 sm:text-sm">
                        <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        {class_.time}
                      </div>
                      <div className="mt-1 flex items-center text-xs text-gray-600 sm:text-sm">
                        <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        {class_.location}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-left sm:text-right">
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        {class_.students} alunos
                      </p>
                      <Button
                        size="sm"
                        className="bg-primary-green hover:bg-primary-green/90 mt-2 text-xs text-white-default sm:text-sm"
                      >
                        Registrar Frequência
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <ClipboardCheck className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="bg-primary-green mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        {activity.action}
                      </p>
                      <p className="truncate text-xs text-gray-600 sm:text-sm">
                        {activity.class}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <Button className="bg-primary-green hover:bg-primary-green/90 h-10 text-xs text-white-default sm:h-12 sm:text-sm">
                <ClipboardCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Registrar Frequência
              </Button>
              <Button
                variant="outline"
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white h-10 bg-transparent text-xs sm:h-12 sm:text-sm"
              >
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Ver Minhas Turmas
              </Button>
              <Button
                variant="outline"
                className="border-purple text-purple hover:bg-purple hover:text-white h-10 bg-transparent text-xs sm:h-12 sm:text-sm"
              >
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Ver Cronograma
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
