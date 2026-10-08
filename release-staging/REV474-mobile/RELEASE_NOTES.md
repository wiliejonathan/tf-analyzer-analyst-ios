REV474 / v1.17.87

- Reduce dashboard scrolling work: remove decorative table glow, render offscreen large tables on demand, batch chart hover and resize work, and limit chart pixel density on low-resource devices. Print/export retains full tables.
- Separate Table Adjustment Value of Pairs below Analyst adjustment risk. Both closed by default with triangle controls. Shared risk controls in Analis Report; compact signed Pips/Dollar cells and wider, shorter rule dialog.
- Apply shared changes to Android, iOS/browser and website.

Validation: 5,000-row scroll at 4x CPU throttle preserves data; 100 hover events become one update; unchanged chart widths avoid redraws. Browser navigation, risk calculations, mobile controls and exports regression tested.
