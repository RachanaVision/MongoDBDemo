using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace MongoDBDemo.Models
{
    public class EmployeeRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public int Age { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string City { get; set; }

        //[Required]
        //public string Hobby { get; set; } 

        // public List<string> Hobby { get; set; }
        public Hobby Hobby {get; set;}
    }

    public class Hobby
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public List<string> Hobbies { get; set; }
    }
}
