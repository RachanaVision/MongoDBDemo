using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDBDemo.Models;
using System.Diagnostics;

namespace MongoDBDemo.Controllers
{
    public class HomeController : Controller
    {

        private readonly IConfiguration _configuration;
        private readonly MongoClient _mongoClient;
        private readonly IMongoCollection<EmployeeRequest> _mongoCollection;

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
            _mongoClient = new MongoClient(_configuration["DatabaseSettings:ConnectionString"]);
            var _mongoDatabase = _mongoClient.GetDatabase(_configuration["DatabaseSettings:DatabaseName"]);
            _mongoCollection = _mongoDatabase.GetCollection<EmployeeRequest>(_configuration["DatabaseSettings:CollectionName"]);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult InsertUpdate()
        {
            return View();
        }

        public async Task<IActionResult> InsertRecord([FromBody]EmployeeRequest request)
        {
            try
            {
                if(request != null)
                {
                    request.Hobby.Id = ObjectId.GenerateNewId().ToString();
                    await _mongoCollection.InsertOneAsync(request);
                    return Ok();
                }
                else
                {
                    throw new ArgumentNullException();
                }               
            }
            catch (Exception ex)
            {
                throw ex;
            }           
        }

        public async Task<IActionResult> GetAllRecord()
        {
            try
            {
                var employeeList = _mongoCollection.Find(x => true).ToList();
                return Ok(employeeList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> GetRecordById(string id)
        {
            try
            {
                var emplpoyee = _mongoCollection.Find(x=>(x.Id == id)).FirstOrDefault();
                return Ok(emplpoyee);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> UpdateRecord([FromBody] EmployeeRequest request)
        {
            try
            {
                if (request != null)
                {
                    await _mongoCollection.ReplaceOneAsync(x => x.Id == request.Id, request);
                    return Ok();
                }
                else
                {
                    throw new ArgumentNullException();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> UpdateHobbies([FromBody] EmployeeRequest request)
        {
            try
            {
                if(request != null)
                {                   
                    var hobbies = Builders<EmployeeRequest>.Update.Set(request => request.Hobby.Hobbies,request.Hobby.Hobbies);                   
                    await _mongoCollection.FindOneAndUpdateAsync(x=> x.Id == request.Id , hobbies);

                    return Ok();
                }
                else
                {
                    throw new ArgumentNullException();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> DeleteRecord(string id)
        {
            try
            {
                await _mongoCollection.DeleteOneAsync(x => x.Id == id);
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<IActionResult> DeleteAllHobbies(string id)
        {
            try
            {
                var filter = Builders<EmployeeRequest>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<EmployeeRequest>.Update.Set("Hobby.Hobbies", new List<string>());

                await _mongoCollection.UpdateOneAsync(filter, update);

                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
