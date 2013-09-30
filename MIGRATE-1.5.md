# Migration to 1.5 

## from 1.4 or 1.3

  - the new knockout version does not allow to call applyBindings() for multiple times on the same element. Get your ducks in a row(!)
  - The way to load the library is completely changed: Be sure to include the psc-cms-js config.js before loading require.js. Then bootstrap as usual.
  - Psc/UI/jqx/GridTableEditor was removed completely
  - Psc/ko/Table was removed completely
  - jqx.grid is no longer avaible