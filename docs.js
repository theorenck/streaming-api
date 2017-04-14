r.table('zw15its').insert(r.http('http://localhost:4000/api/v1/entities/zw15its', {
  params: {
    sort: '-codservico,codseqservico',
    limit: 1000
  },
  page: 'link-next',
  pageLimit: 100,
  header: {
    'Authorization':'Basic emV0YTphMDMwbWVjeg=='
  }
}))
