import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import {
    Card,
    CardContent,
    Typography
} from "@mui/material";

import BarChartIcon from "@mui/icons-material/BarChart";

import EmptyState from "../../../components/common/Empty/EmptyState";

function DashboardMonthlyChart({ data, isMobile })
{

    return (

        <Card
            sx={{
                borderRadius: 3,
                height: "100%"
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={3}
                >

                    Agenda Bulanan

                </Typography>

                {

                    data.length === 0

                        ? (

                            <EmptyState

                                icon={

                                    <BarChartIcon

                                        sx={{
                                            fontSize: 60
                                        }}

                                    />

                                }

                                title="Belum ada data"
                                subtitle="Belum ada data agenda untuk ditampilkan."

                            />

                        )

                        : (

                            <ResponsiveContainer
                                width="100%"
                                height={isMobile ? 220 : 280}
                            >

                                <BarChart
                                    data={data}
                                    margin={{
                                        top: 10,
                                        right: isMobile ? 5 : 20,
                                        left: isMobile ? 0 : 0,
                                        bottom: 0
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        width={isMobile ? 20 : 40}
                                    />

                                    <Tooltip
                                        wrapperStyle={{
                                            fontSize: 12
                                        }}
                                    />

                                    <Bar
                                        dataKey="total"
                                        radius={[8, 8, 0, 0]}
                                        fill="rgb(15,0,95)"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        )

                }

            </CardContent>

        </Card>

    );

}

export default DashboardMonthlyChart;