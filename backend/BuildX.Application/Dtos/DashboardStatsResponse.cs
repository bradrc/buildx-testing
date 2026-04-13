namespace BuildX.Application.Dtos;

public class DashboardStatsResponse
{
    public int TotalUsers { get; set; }
    public int ActiveSessions { get; set; }
    public double Revenue { get; set; }
    public int SystemHealth { get; set; }
    public ChartDataResponse ChartData { get; set; } = new();
}

public class ChartDataResponse
{
    public string[] Labels { get; set; } = Array.Empty<string>();
    public double[] Values { get; set; } = Array.Empty<double>();
}
