if (expect && expect.addSnapshotSerializer) {
  expect.addSnapshotSerializer({
    test: (val) => typeof val === 'bigint',
    print: (val) => String(val) + 'n'
  })
}
