using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SciChart.AspNetCore.SimpleLicensing;

public static class SciChartSimpleLicensingServiceCollectionExtensions
{
    /// <summary>
    /// Registers <see cref="ISciChartLicenseTokenService"/> and binds options from a delegate.
    /// </summary>
    public static IServiceCollection AddSciChartSimpleLicensing(
        this IServiceCollection services,
        Action<SciChartSimpleLicensingOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);
        services.Configure(configure);
        services.AddSingleton<ISciChartLicenseTokenService, SciChartLicenseTokenService>();
        return services;
    }

    /// <summary>
    /// Registers <see cref="ISciChartLicenseTokenService"/> and binds options from a configuration section
    /// (e.g. <c>builder.Configuration.GetSection("SciChart")</c>).
    /// </summary>
    public static IServiceCollection AddSciChartSimpleLicensing(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        services.Configure<SciChartSimpleLicensingOptions>(configuration);
        services.AddSingleton<ISciChartLicenseTokenService, SciChartLicenseTokenService>();
        return services;
    }
}
