using Microsoft.AspNetCore.Razor.TagHelpers;

namespace SciChart.AspNetCore.SimpleLicensing;

/// <summary>
/// Renders the SciChart Simple Server Validation v2 token as
/// <c>&lt;meta name="x-scichart-license" content="v2:..." /&gt;</c>.
/// Place inside <c>&lt;head&gt;</c> in <c>_Layout.cshtml</c>.
/// </summary>
/// <remarks>
/// Usage: <c>&lt;scichart-license /&gt;</c>. The tag helper is auto-discovered via
/// <c>@addTagHelper *, SciChart.AspNetCore.SimpleLicensing</c> in <c>_ViewImports.cshtml</c>.
/// </remarks>
[HtmlTargetElement("scichart-license", TagStructure = TagStructure.WithoutEndTag)]
public sealed class ScichartLicenseTagHelper : TagHelper
{
    private readonly ISciChartLicenseTokenService _tokenService;

    public ScichartLicenseTagHelper(ISciChartLicenseTokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "meta";
        output.TagMode = TagMode.SelfClosing;
        output.Attributes.SetAttribute("name", "x-scichart-license");
        output.Attributes.SetAttribute("content", _tokenService.CreateInlineToken());
    }
}
