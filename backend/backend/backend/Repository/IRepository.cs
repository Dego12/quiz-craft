using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace backend.Repository
{
    public interface IRepository<T> where T : class
    {
        T GetById(Guid id);
        IEnumerable<T> GetAll();
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);

    }
}
