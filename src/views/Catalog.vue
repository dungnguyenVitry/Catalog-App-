<template>
  <div class="container">
    <!-- Logout button -->
    <button @click="logout" class="logout-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
      </svg>Log out
    </button>

    <!-- Search and filter fields -->
    <div class="row mb-3">
      <!-- Search field -->
      <div class="col-md-8">
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Search">
          <button class="btn-search" @click="search">Search</button>
        </div>
      </div>
      <!-- Filter field -->
        <div class="col-md-4">
        <select class="form-select" v-model="filter" @change="handleFilterChange">
            <option value="all">All</option>
            <option value="lastHour">Last Hour</option>
            <option value="yesterday">Yesterday</option>
            <option value="lastWeek">Last Week</option>
        </select>
        </div>
    </div>

    <!-- Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Type</th>
          <th>Name    
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5072A7" class="bi bi-sort-alpha-down custom-icon" viewBox="0 0 16 16" @click="sortCatalogDataByNameAscending">
                <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5072A7" class="bi bi-sort-alpha-down-alt custom-icon" viewBox="0 0 16 16" @click="sortCatalogDataByNameDescending">
                <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z"/>
                <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"/>
                <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
            </svg>
          </th>
          <th>MAC</th>
          <th>IPV4</th>
          <th>Online</th>
          <th>Description</th>
          <th>Date 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5072A7" class="bi bi-arrow-down-short custom-icon" viewBox="0 0 16 16" @click="toggleDateFilterDirection">
              <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/>
            </svg>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in catalogItems" :key="item._id">
          <td>{{ item.type }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.mac }}</td>
          <td>{{ item.ipv4 }}</td>
          <td>{{ item.online }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatDateTime(item.creationDate)}}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="loadPrevPage" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span> 
      <span class="count">(Total Items found: {{ totalCount }})</span>
      <button @click="loadNextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
    data() {
    return {
        catalogItems: [],
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        filter: 'all',
        limit: 10, 
        searchQuery: '', 
        sortByDate: 'descending',
    };
    },

  created() {
    // check if token in localStorage or not
    const token = localStorage.getItem('token');
    if (!token) {
      // it not, let move in login page
      window.location.href = '/login';
    } else {
      this.fetchCatalogItems();
    }
  },
  methods: {
    // fetch data
    async fetchCatalogItems() {
        try {
            const response = await axios.get(`http://localhost:3000/catalog`, {
                params: {
                    page: this.currentPage,
                    limit: this.limit,
                    filter: this.filter,
                    sortByName: this.sortByName,
                    sortByDate: this.sortByDate,
                    search: this.searchQuery,
                }
            });

            this.catalogItems = response.data.data;
            this.totalPages = Math.ceil(response.data.totalCount / this.limit);
            this.totalCount = response.data.totalCount;
        } catch (error) {
            console.error('Error fetching catalog items:', error);
        }
    },

    // handle filter from select (lastHour,yesterday,lastWeek)
    handleFilterChange() {
      this.currentPage = 1;
      this.fetchCatalogItems();
    },

    // tonggle direction of filter by time
    async toggleDateFilterDirection() {        
        this.sortByDate = this.sortByDate === 'descending' ? 'ascending' : 'descending';
        this.currentPage = 1;
        this.sortByName = undefined;        
        await this.fetchCatalogItems();
    },

    async loadPrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchCatalogItems();
      }
    },
    async loadNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchCatalogItems();
      }
    },

    //function search
    async search() {
        try {
            this.currentPage = 1; 
            await this.fetchCatalogItems();
        } catch (error) {
            console.error('Error searching catalog items:', error);
        }
    },

    // sort by Name, alphabet
    async sortCatalogDataByNameAscending() {
    this.sortByName = 'ascending';
    this.currentPage = 1;
    this.sortByDate = undefined;    
    await this.fetchCatalogItems();
    },

    async sortCatalogDataByNameDescending() {
    this.sortByName = 'descending';
    this.currentPage = 1;
    this.sortByDate = undefined;
    await this.fetchCatalogItems();
    },


    formatDateTime(dateTimeString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateTimeString).toLocaleString('en-US', options);
    }, 
    
    logout() {
      localStorage.removeItem('token');
      console.log("test click");
      window.location.href = '/login';
    }
  }
};
</script>

<style scoped>
.container {
    margin-top: 20px;
}

.search-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-bar {
    display: flex;
    align-items: center;
}

.search-bar input[type="text"] {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
}

.btn-search {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: #5072A7; 
  color: white; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-search:hover {
  background-color: #0056b3; 
}

th, td {
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px;
}
th {
    white-space: nowrap;
}


tr:nth-child(even) {
    background-color: #f2f2f2;
}


tr:hover {
    background-color: #dddddd;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #5072A7;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
}

.pagination button:hover {
  background-color: #f2f2f2;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination span {
  margin: 0 10px;
}

.count {
  margin-left: 10px;
}

.custom-icon {
    width: 24px;
    height: 24px;
    color: blue; 
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  padding: 8px 16px; 
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute; 
  top: 20px; 
  right: 20px; 
}

.logout-btn:hover {
  background-color: #c82333;
}

@media screen and (max-width: 1024px) {
  .container {
    width: 90%;
    margin: 20px auto;
  }

  .search-bar input[type="text"] {
    width: 70%;
  }
}

@media screen and (max-width: 1440px) {
  .container {
    width: 80%;
    margin: 20px auto;
  }

  .search-bar input[type="text"] {
    width: 60%;
  }
}
@media screen and (max-width: 768px) {
  .container {
    width: 90%;
    margin: 20px auto;
  }

  table{
  font-size: 12px;
  }

  .logout-btn{
  margin-right: 20px;
  }
}
</style>
