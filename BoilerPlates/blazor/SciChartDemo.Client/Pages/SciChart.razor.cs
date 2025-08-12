using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace SciChartDemo.Client.Pages
{
    public class SciChartComponent : ComponentBase, IAsyncDisposable
    {
        [Inject] internal IJSRuntime JSRuntime { get; set; }

        protected ElementReference _chartRoot;

        public async Task Init()
        {
            await JSRuntime.InvokeVoidAsync("sciChart.init", _chartRoot);
        }

        public async Task AddRenderableSeries(FastLineRenderableSeries fastLineRenderableSeries)
        {
            await JSRuntime.InvokeVoidAsync("sciChart.appendFastLineRenderableSeries", _chartRoot, fastLineRenderableSeries);
        }

        public ValueTask DisposeAsync()
        {
            return JSRuntime.InvokeVoidAsync("sciChart.unregister", _chartRoot);
        }
    }

    public record FastLineRenderableSeries
    {
        public List<DataPoint> DataSeries { get; init; } = new();
        public string Stroke { get; set; } = "";
        public int StrokeThickness { get; set; } = 1;
    }

    public record DataPoint
    {
        public double X { get; init; }
        public double Y { get; init; }

        public DataPoint()
        {
        }

        public DataPoint(double x, double y)
        {
            X = x;
            Y = y;
        }
    }
}