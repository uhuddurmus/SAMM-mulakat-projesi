using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using System.Text;

namespace MapApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointsController : ControllerBase
    {
        private readonly string _jsonFilePath = Path.Combine("Data", "points.json");

        [HttpGet]
        public ActionResult<IEnumerable<Point>> GetPoints()
        {
            try
            {
                var json = System.IO.File.ReadAllText(_jsonFilePath);
                var points = JsonConvert.DeserializeObject<List<Point>>(json);
                return Ok(points);
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult AddPoint(Point point)
        {
            try
            {
                // Read the file without sharing it to prevent conflicts with other processes
                var json = System.IO.File.ReadAllText(_jsonFilePath);
                var points = JsonConvert.DeserializeObject<List<Point>>(json);

                // Add the new point
                point.Id = points.Count > 0 ? points.Max(p => p.Id) + 1 : 0;
                point.DateTime = DateTime.UtcNow;
                points.Add(point);

                // Write the updated points list back to the file with FileShare.None
                System.IO.File.WriteAllText(_jsonFilePath, JsonConvert.SerializeObject(points), Encoding.UTF8);

                return Ok(points);
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePoint(int id)
        {
            try
            {
                // Read the file without sharing it to prevent conflicts with other processes
                var json = System.IO.File.ReadAllText(_jsonFilePath);
                var points = JsonConvert.DeserializeObject<List<Point>>(json);

                // Find and remove the point with the specified ID
                var pointToRemove = points.FirstOrDefault(p => p.Id == id);
                if (pointToRemove == null)
                {
                    return NotFound();
                }
                points.Remove(pointToRemove);

                // Write the updated points list back to the file with FileShare.None
                System.IO.File.WriteAllText(_jsonFilePath, JsonConvert.SerializeObject(points), Encoding.UTF8);

                return Ok(points);
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("DownloadJsonFile")]
        public IActionResult DownloadJsonFile()
        {
            try
            {
                // Read the file without sharing it to prevent conflicts with other processes
                var json = System.IO.File.ReadAllText(_jsonFilePath);

                // Return the file content as a downloadable file
                var fileName = Path.GetFileName(_jsonFilePath);
                var fileBytes = System.Text.Encoding.UTF8.GetBytes(json);
                var fileStream = new MemoryStream(fileBytes);
                return File(fileStream, "application/json", fileName);
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
