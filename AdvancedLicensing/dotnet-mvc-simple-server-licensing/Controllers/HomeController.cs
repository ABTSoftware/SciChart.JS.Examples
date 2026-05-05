using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcSimpleServerLicensing.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
