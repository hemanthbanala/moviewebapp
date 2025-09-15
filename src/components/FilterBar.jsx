import React from 'react';

const FilterBar = ({ filters, setFilters, genres }) => (
  <div className="flex flex-wrap gap-4 mb-4">
    {/* Genre Filter */}
    <select
      value={filters.genre}
      onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
      className="p-2 rounded border 
                 bg-white dark:bg-gray-800
                 text-black dark:text-white
                 border-gray-300 dark:border-gray-600"
    >
      <option value="">All Genres</option>
      {genres.map(g => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>

    {/* Rating Filter */}
    <select
      value={filters.rating}
      onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}
      className="p-2 rounded border 
                 bg-white dark:bg-gray-800
                 text-black dark:text-white
                 border-gray-300 dark:border-gray-600"
    >
      <option value="">All Ratings</option>
      {[...Array(10).keys()].map(n => (
        <option key={n + 1} value={n + 1}>
          {n + 1}+
        </option>
      ))}
    </select>

    {/* Language Filter */}
    <select
      value={filters.language}
      onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
      className="p-2 rounded border 
                 bg-white dark:bg-gray-800
                 text-black dark:text-white
                 border-gray-300 dark:border-gray-600"
    >
      <option value="">All Languages</option>
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="es">Spanish</option>
      <option value="ja">Japanese</option>
      <option value="fr">French</option>
      <option value="de">German</option>
      <option value="zh">Chinese</option>
      <option value="te">Telugu</option>
      <option value="ta">Tamil</option>
      <option value="ml">Malayalam</option>
      <option value="kn">Kannada</option>
      <option value="mr">Marathi</option>
      <option value="bn">Bengali</option>
      <option value="pa">Punjabi</option>
      <option value="ko">Korean</option>
      {/* Add more languages as needed */}
    </select>
  </div>
);

export default FilterBar;
