using Microsoft.AspNetCore.Mvc;
using SciChart.Server.Licensing;

namespace DotnetServerLicensing
{
    [ApiController]
    public class LicenseController : ControllerBase
    {
        private readonly ILicenseServer licenseServer;

        public LicenseController(ILicenseServer licenseServer)
        {
            this.licenseServer = licenseServer;
        }

        [Route("api/license")]
        [HttpGet]
        public string Validate()
        {
            return this.licenseServer.ValidateLicense(this.Request.QueryString);
        }
    }
}
