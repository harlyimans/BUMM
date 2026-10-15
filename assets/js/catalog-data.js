/* ------------------------------------------------------------------------
   Product catalog data — edit this file only.
   One object per part:
     segment     : automotive | agriculture | heavy-duty | general-casting | train
     customer    : customer name shown on the card
     partName    : part name
     materialNo  : material number
     image       : file name inside assets/img/ (or a full path / URL)

   TODO(client): every row below is SAMPLE data (placeholder customers, names
   and numbers, reusing the existing part-*.png images). Replace with the real
   catalog; add new rows by copying a line.
   ------------------------------------------------------------------------ */
window.BUMM_CATALOG = {
  segments: [
    { key: 'automotive',      label: 'Automotive' },
    { key: 'agriculture',     label: 'Agriculture' },
    { key: 'heavy-duty',      label: 'Heavy Duty' },
    { key: 'general-casting', label: 'General Casting' },
    { key: 'train',           label: 'Train Component' }
  ],
  parts: [
    { segment: 'automotive',      customer: 'Customer A', partName: 'Part Name Automotive 01', materialNo: 'MN-0000-0001', image: 'part-automotive-1.png' },
    { segment: 'automotive',      customer: 'Customer B', partName: 'Part Name Automotive 02', materialNo: 'MN-0000-0002', image: 'part-automotive-2.png' },
    { segment: 'automotive',      customer: 'Customer A', partName: 'Part Name Automotive 03', materialNo: 'MN-0000-0003', image: 'part-automotive-3.png' },
    { segment: 'agriculture',     customer: 'Customer C', partName: 'Part Name Agriculture 01', materialNo: 'MN-0000-0004', image: 'part-agriculture-1.png' },
    { segment: 'agriculture',     customer: 'Customer C', partName: 'Part Name Agriculture 02', materialNo: 'MN-0000-0005', image: 'part-agriculture-2.png' },
    { segment: 'agriculture',     customer: 'Customer D', partName: 'Part Name Agriculture 03', materialNo: 'MN-0000-0006', image: 'part-agriculture-3.png' },
    { segment: 'heavy-duty',      customer: 'Customer B', partName: 'Part Name Heavy Duty 01', materialNo: 'MN-0000-0007', image: 'part-heavy-duty-1.png' },
    { segment: 'heavy-duty',      customer: 'Customer E', partName: 'Part Name Heavy Duty 02', materialNo: 'MN-0000-0008', image: 'part-heavy-duty-2.png' },
    { segment: 'heavy-duty',      customer: 'Customer E', partName: 'Part Name Heavy Duty 03', materialNo: 'MN-0000-0009', image: 'part-heavy-duty-3.png' },
    { segment: 'general-casting', customer: 'Customer D', partName: 'Part Name General Casting 01', materialNo: 'MN-0000-0010', image: 'part-general-casting-1.png' },
    { segment: 'general-casting', customer: 'Customer F', partName: 'Part Name General Casting 02', materialNo: 'MN-0000-0011', image: 'part-general-casting-2.png' },
    { segment: 'general-casting', customer: 'Customer F', partName: 'Part Name General Casting 03', materialNo: 'MN-0000-0012', image: 'part-general-casting-3.png' },
    { segment: 'train',           customer: 'Customer G', partName: 'Part Name Train Component 01', materialNo: 'MN-0000-0013', image: 'part-train-1.png' },
    { segment: 'train',           customer: 'Customer G', partName: 'Part Name Train Component 02', materialNo: 'MN-0000-0014', image: 'part-train-2.png' },
    { segment: 'train',           customer: 'Customer A', partName: 'Part Name Train Component 03', materialNo: 'MN-0000-0015', image: 'part-train-3.png' }
  ]
};
