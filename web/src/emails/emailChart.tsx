import {Label, Pie, PieChart} from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
    send: {
        label: "Send",
        color: "hsl(var(--chart-0))",
    },
    open: {
        label: "Open",
        color: "hsl(var(--chart-1))",
    },
    click: {
        label: "Click",
        color: "hsl(var(--chart-2))",
    },
    submit: {
        label: "Submit",
        color: "hsl(var(--chart-3))",


    },
} satisfies ChartConfig

export function EmailChart(props: {
    chartData: {
        emails: number,
        send: number,
        open: number,
        click: number,
        submit: number
    }
}) {

    const chartData = [
        {type: "send", amount: props.chartData.send, fill: "hsl(var(--chart-5))"},
        {type: "open", amount: props.chartData.open, fill: "hsl(var(--chart-2))"},
        {type: "click", amount: props.chartData.click, fill: "hsl(var(--chart-3))"},
        {type: "submit", amount: props.chartData.submit, fill: "hsl(var(--chart-4))"},
    ]

    return (
        <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({viewBox}) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {props.chartData.emails}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Emails
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
