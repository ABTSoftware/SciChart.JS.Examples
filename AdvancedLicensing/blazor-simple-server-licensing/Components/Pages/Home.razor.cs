using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SciChart.Blazor.Components;

namespace blazor_simple_server_licensing.Components.Pages;

public partial class Home : ComponentBase
{
    [Inject]
    private IJSRuntime JS { get; set; } = null!;

    // Gate the chart until the SciChart license is set, so the first surface is built licensed.
    private bool _licenseReady;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            var YOUR_RUNTIME_LICENSE_KEY = "SET_YOUR_RUNTIME_LICENSE_KEY_HERE";
            await SciChartSurface.SetRuntimeLicenseKeyAsync(JS, YOUR_RUNTIME_LICENSE_KEY);

            _licenseReady = true;
            StateHasChanged();
        }
    }
}
