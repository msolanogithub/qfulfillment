const LOGO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR8AAABOCAYAAAAZ8hKrAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6QkGFjAReLkUhAAAFFhJREFUeNrtnXmYFcW1wH+zoSIwhEWRwDgKIiZi1Bgk0RjcYl6IZvw0GvNFwQWXRI0xMbgkvklinhqfGpMXQdCo5MUNkrhkweSJiBrRiBgUFAF3RBZxZthmBmbm/XG6c+/c6a6lu3oasH7fd75Z7u06VdXd1VWnzjkNHo/H4/F4PB6Px+PxeDwej8fj8Xg8Ho9n+2V/oGfelfBkTjVQlnclPAUq865ADB8DRgB9gd5AL2ArsAFoAN4C3gn+l5ZDgGnAl4DGvBvucUo1cAJwCvBFYDTwr7wr5dl2qAQOB64GHgNWAx0GsgVYCNwGnAEMSKh/QlDeAmBg3p3hSU0/4GzgT0ALna+ZH+ddOc+2wWjgVmAdZoONTtqAx5ELz2YZNaGojMXAkLw7xmNNOODMQh5KcdfIKvwS+yNLGVAHvICbASdO1gE/x2w2NKHk2GXAsLw7ymPFrzG/Nq7Ju7Ke7udIZGmT5aBTKhuAetRPuwnBd19FBp4O4F38ALQ9MRrza6IFOCjvCnu6h4HAdLp30CmV5cAxMfW7IvjOPciSa03wd13eHeex4jHMr4dZeVfWkz1fAN4j34GnWG4Cqorq1xuYGXx2PbIsXB/8PSLvzvNYMRxoIv7cfwhMRa7J8rwr68mWHyBb4XkPOKUyD5gCPAO0Fv3/80Bt8HszUJF3B3qsOQpZahcvsWYCJwI75V05T/ZUALeT/yBjKq8CpwZ1Hxf878W8O9GTmAOA+4FzED8fzzaKayfDGmSX6dS0BWXAWuBt4HVgCbAIeDb4O2T/4OdLeVfWk5iFbJvXn6cEF4NPH8TJ7zTgcxGfrwTeDH5+iEyLQzYhS59S2hDbSymtwTHFNAHtEcduBjYi2+5rEP8PHQcEPxc56BePx5MR/YHrKBhoO5Abfw7wQ2RrfXub9i4N2vHFvCvi8Xi6Ug5cSGfP5MXARcBueVcuBUMoDKDb26Dp8ezwDEN2i8JBZyHiD7MjRAt/N2jTU3lXxOP5KGBj8zkRuBvxjVkPXI74Tagiy2uAg4GhyMxid8TPZtfg89CG04zYbtYA7yPBpa8BbyjK3hOJ1Wl20A8DgO8Hv//OSc+6ow/SfzVI//UEeiADZSOwAnkIrOqm+gxCAoH3RWa/kw2PGwkcBuyFzC6bkMwES3ATaV4d1Gs4cv08jNj8PO6pAgYj1+QQ5H7uFXy2EbkuFyE7yW1plX0PMeqGM4OamO9VAl8GfosMImm2wK9V1GdnChHLq4D5wEPAr4BJiPH7cGSAqtKU85Wgk0JHtJ1dnaGE7AaMRzyuX7for2VI1HZ/x/WpROx3v0CW16V6P644dnfgSgr9GyV/SVG3wcAFwP/RNaD0N477oZi+SJqOacBzyC7q48H/XVEDnAc8ALwS6JiN+KN1NxXINXA9svIpzRYQJ5sQP6vDkyqeVFTYrUTPlsqRGKllpBtwiuWrijp93qKcdsTLeh5ykT6F+PG8hYzKpd8/KuszGUEv4EwkRCCqTjayjvShIbsAJyFhMaqsA81EXw/DkVQnrejPzQHY0Rc4F5hL4YEYJbc7Pke7AecDjxIfOX9SSh0jgR8hs4a4dj3ruF0qxiAOuaZpblRyJzJjN2Z80cFXxnxnb+BJB5Urld0V9boiA32hzOue8wqIX9FUOnvlupA2JImWDeGAc59FfZ4vKWMwcrGaerZPN6xbFXA8MAPzp+5pDs5PNXIP6FJ1hPIfCXQMRUwYCwzblWamaEIvZEPpFcP62MifMAxtORB5snUgW+pRjKIQiOlS3tDU7S8Z6CyWIzI+wWORWVip3jXINPvHwLeRJcXlyA39omUb1qBfBiQZcIrljqCcHkE9bcpoQZbFKkYhyz3ba2wDBRuELT2QmeNMzAe6UPY21NEHmek+jnr2FiXfSdguHQOQ+7yxRN8W4GngZsT8MhG4FFmCzaKzq42JnKOryE4U1vePEL2b1Q9JPZHFzX+vom7lSCrVLAef32d0gg9D/KBK9f0ZOBr9U+ETSOiAaTsuiTm3J5B8wCmWi5Cn/dIEx94U08Y+iK3jnynq9b8Jzs2hSF6gtQl1LtOUXxH01T2ILSSJjk24tSuBpCy+jq7XwtvI9dNPc3xvZKbU4KifuCr44iriDZh3J+zApDdNyKgM9YbSituUqvsgA1rUiTgyQXmmy87ZJcedRdcnW1iP3yMzrAfQ22pCWVLydxtir5iJ2FxuAe4CHkRsbauC7zXQOdFbGTLbnE7yG7NYjjPsx1rkWn/Ngc76GB2jgBsQD/+0Ou7AHT2QmcyHJTq2Aj9BZsU27GPRxn3jCulLYRT7Zsx39sV+umgjYxSNPCtDvcVynoMT3Bu58KLsBX8MPk/KIwZteK/kmPCBsQj4H+BkogfZ71v0U1tQl1ORp6iOamS7vZhvlZTZjMwQf4YsCw9BZo0LDOqzErOMBCdGHNuEGJTrEZvRcUQ/NKIeVsXpdwcjD9CojJ2NyMxsPGLaGA38w7CvD7a6QuIZh+S4Ki1/NSl2ppCdbpN21MUVUB98YTHxy4BrDZUkkRbU6Q+mZKi7WNIa9r6B+OBElT2Z9DllDjVoQ2nc3BGot8ZDjjIoezWSkrTGoDwdk5Et62uRpG9xT916g3rdbKhzEjJwzkXCgT5D9KA1BL3OKRR2w56k64O5CZkJfolo14+zDXS42OUahhh9o8pfhrnNSoVJiuSJUQdWUZgaqyKD/2WgIKnoOjmNLcBGNpIs8LY/YsOJK3cqbjzCyzAzxCbhFINyxzpoQ4hpPz9uUC/TFKkHYRYONMJA5yKiXSRmA6ejT1p/gYGOCSn7+Hzil7Tv4uYhArJk07Xl4qgDTwg+VE1de5BtkrBbFA3bCbMtT1dyqGXHD0Pt6zQLt0nKdC4OLQnLvU1T7ssO22DKYPRL/SyyEVyE3TWzCpkR7mWhY6qmzHUkd34tQ5bYcWVvQpZ/rvi6QR+Njzrw3uDDGxWF7255MmxF5Z9hkyjchdjYffZAXATiylqN+/eCPaip/xsJyuyBfkZ1vuN2mBDG3qnkCsc6yzE3Rs9FbjwrRzpkVtSgKfu/U7ThJk3ZFzjus2MN+qqLP1QZhW3GwxSF72FQeBpRrTu/nbHuUvmlYYdXIrs5qrLqHJ9kgL9qdP49QZmnacpspBCb150UBzRHSTvisOeSr2p0bkTsVaNS6DjToF3DE5Z9hqbsv+E+KPx49PfVPqUH7R18sAX1NlsV2e10rdY07K6M9MbJQ4YdfpWmnKzelvCiRu/PE5T5tKbMmzNqi4ph6M/VnAz0ztXovDh50f/mOY2ORxOWW4M6of5WIgYBB5yraU8jEZst4TbZfAMFi9FfDEnkEY3eRRnpjZPnDPpiDyRroqocV1ukxVRR8ECPE1N/l5CDNOW1k80Fq8PEr+lsxzoP0ej7gORe1CEHGrSrLmHZ92rKdR37FvIrjd7Ie3xi8OFfDRTcZdBpSeRKhc5dSR90aStLDPpisqaMPzs+uSGHa/Q2Yv/Ghjs0ZZpcG1nwkqZezbhPAPc7jU4Xbz69VaPjHZJtUHwK9eqkHXGwzIKFmjadFXXQJcGHJvlsvon+xk0ixyh06m62LORNTT8MQe8NfLzz0ytcr9F7q2V5/dB7F4/LqC0qPoH+PD3gWOdQ1Luqm0mftXNX1MuiDsT/KAk6x8isglNrNXqbiHGsvTj4wkwDJQNwb/dpQ+3xe6ljfS4Gn2s0x79HNu//KkeeinF6t2JvpLxM05bl5POyvZ+iP0+uB/gbNPqmONChcyxsRRK32TIUvSvMyY77K+SHGr03xB0Y7nLMNVTkOo2GzndENw3OQhYq6lPskBkntzk9tQW+ptE71bK8ctRuAh3I4J8HuqDVtagTxtnSC/XWtyu7l87QfH/CcnUPxGay2a3sQbxHfwcSQzYg7uAxwZdWGCoz8cq0kWkafUsc6zMRVW6fcQbH2+bUMaEMtQv7KvSRyKXotkc3Yha35ZpPo+/jXzvWGa4A4sRkZaBDZ9jvIJkHeRmSJE9VblY7r+do9E5UHdyTwnTNxNXaJLbIRlR5Pqod6zIV1dNnusHxWbzNQ2dvS2KXmaUp03Ym5Yqb0ffxmMSld6UC/QxwtAM9Oo/mpJ7aY9D3V73D/grphTqiPS4tTyeeCL6s8l8oQzx/XWff20+h08RrMgtR+cnoclSvdH+O6a/R+18JyjSJXbJNdeqCSvR9vNSxzpM1+kxNEirCFzCo9FyYsOyr0Z/LOsd9BpLwLU7f6xjOxMM4lgUxn38ccXpyfZN/gHpk1K1js5IzYuqzl8GxJj5Cttyn0DeDZAbhWzTteCKDdphgkp7hPx3r1DlYutjt0znhbUASqiXB5N48xHGfjSV+82kd6klFJ/oh6/sOujqonU52GQR1zoW60IWsZGRMfUxmYn9zfJJVNraHsY8pApkuN6JuxymO22GKaqANJWnYQRQ6M8LLuAlFmK/Rk2aTwsQu6rLPBhG/3GrEPjD731OoF5A18EA6BzBuRN9AW5mkqE9PzDPruZS1xM8k6gyOf8zhST5W0QczSDbwgASIqtqwgmRpRdJSjd5r3HWi/xkafRMc6DAxoH8qQbkViLf0OoPyRyYoP4qeSPqbKB2rg7ZaM5DC03A6hQjnLchrPb5g0EBbUQWyHp2BPhNR5QGuMzj+NUcn+VDiZyfXkc6PSBeu8iNHbbDFJLmWrQNeGXJjX0ZX/5la1L4x75J8gC9GZ2heaFHWLshu6m+Qe/R2xC9N129HO2jHLsTnrHoJu3QiXTg/osADg8/KSf9CwGJpRp2rpN6hLhv5uqJOhxmWMTjlST6WaC/Y1aR3rDtSU/dW1K8vypJw40MlJi/P2wOx2/2Wgk/W+3Sd0erSTlzmoE190a8afqIpYzdkBvaHkrKWIvenLrTBRIdJO2bHlD0ZfeI0LWVI1rg2JLVlaYyQKjmRrTytqYvOCJiFNKKO7DdJrdmBhEAkoRzJoxwVy/YQbrbwdS74Sd4A4YJazPr2Qbp6xPdDUpXeSPSN+CFdB5Jq1GEODSQ3ABdzpUGbLik5pgKZ+dYjGTyLDbttQR8cR8EW9bCBjpXYJ4cPOYDo/EYrkDf/OqOGeB+KTxo00lRU28ODyDZRfZyYuM/rvJvD2cMxBmUVsz/RBvaluIutGoLeBd+l/4wNP8D8PG0AnkHsP2/GfGczEvtVR3SgrS5ZftIHSDGVSKiNrj3tyEbFNGTnKmpLfjWSWD/KF89kq70DMebb2PJ6ITOmUrtja9A/aV6EkIg5hg3VyViFjvMc6bCRdiSYUcedhuVtQab1IxRlVSFP7Bl0HWxXIk9E2wh1FT/T1Pn55EWn5jHDflVJG+I4OR71rKUStUdwK+mXziCzgrRtegoJgVLZnj5jUd48xGakCk0Zjsy6St9l1o4MYPuSEy4MwU2axuexxf6gYft1+V6i5C0kLcXdiPHxHmRZGWULeB15O2XSKXIcO6F/9/YExzptSGpPbEfiDS/CfFl6qqZMV+/J0u2kqWZ2U7Bz8nzGUsd65NU99yEzrjsRY/LbEd9tRq5dk4dz5kS98tfVjb5fyrKTyFZkSWnKLxzrb0FsOl8muwjy0zV1WEPyZOUuMFnOlj7BLyXZDEX3JhRjBzkNOl+qUlmMDKJJbE0H4ubFi8XyKrIcHmBejew5mHRvslAlaP+l4w40kcmW7a9An7lNJ43IIHw67hNiRRGVC3ktYqychNs3GSTBZDNjHvK2zTSve4nKD9WCzLavwd2rgUwyTnYgy/OZyC5kWmfGsehnt7pZ5HwknUma/NSZc12KRu4ZU+YAsnFmVMkKkr8HezSS3VH3utitiOH4PmTX5XN0rxNfaBNYgviHnI04nblOIp6GPnS1+2xCEmB9h5Q+JEX8gcKbUeuRGzarGZ8q8dsriM+SC9tSMX2R9LMvoM8A+gGyfX4DEt/W316dPS4uup2DBtpOUV8hfu34U5JncUvKONxkeBuEDKq9kV2CDchA+j6SAGxrN7ermBpk92dNjnUw5ZPItvs7yLS/NVVpnSlDBv75yACUNWXIpsFExIl3OeLKcj/yEoCs6YkM2gORwX0rMqCvQfq3qRvqkBn7oY/ULZWrY8oahPuIeZ1cm3cHejye5JyI3Q0ft/Wsc0F3La7fIurxeHLgW5jd8E/GHJ/WgG0rz5LPC/A8Hk8GXI7+po9KYN0DySPUXQPP82xjW4cejyc95xBvYV9K9A7PjXTfwDOH7tnW9ng8MWS5xToOCU7sW/L/r9E1Cfc3MHtfmAumIWkqdbsnlUgMlMfjSU474i3d7exJZ3fv2XQd8I6me5KFNQFnWtS9thvq5MXLji4NcTdY1g5uDUXKG5CYoY6iz49CUqi6fO9SFH9Hcue+mbEej8djiKvBpyeynCpDpliVSLKnc5Egv81IEF/x9OtkZFnmMlq7lKVIyoSHM9Th8Xhyoj8SFRs37VpO59wwFUgOnyynev9EMhGmCc6szbiOXrx8FKQh7gZLO/OpQZIejURsKguQ1JUdSLb/R4B76WzcvRDJA3I3MiNqCY7dgnhJNweyPvhfU/CdzYjnc2vwv2HAVYhzI8F3pyG5bBekbJfH49mGGYUk1u4Ifu7fTXprkKDI0BmxHQnqTBPhHEUt+T81vHjZ3qUh7gZLOvM5ApnV9EECRI9DAtSyZCiSRuE8CtHHDyGzn6Svl1WxDvhuxm3yeHZ0WlwWdhKF/CRPY/gq1BQMR+K9irfjnwA+m7Fej8ezDXEhBc/ll5H0jrVIJHpfJIWEC0Yib+icRedYrzlIrmOPx7OdY+rhXIbk2LnKouzG4OcGZAAJjcZtiDE5/E5ot9kZeU/UCLoOYo8i2eWeyrvDPB6PG0wHnzOQnLJViF/OLsiWefjKjGrH9doMPIfMfP6IZN7zeDw7EK5ju3YlfoDqg/jd9EQi2HsEv5cH312P5BJejry5YUvenePxeDwej8fj8Xg8Ho/H4/F4PB5z/h/Ng/eS2cJHjgAAAC56VFh0ZGF0ZTpjcmVhdGUAAAiZMzIwMtU1sNQ1MAsxMrIysbAyNNc2MLAyMAAAQkYFGBkK/z8AAAAuelRYdGRhdGU6bW9kaWZ5AAAImTMyMDLVNbDUNTALMTKyMrGwMjTXNjCwMjAAAEJGBRgwNVe3AAAAInpUWHRTb2Z0d2FyZQAACJlzTMlPSlXwzE1MTw1KTUypBAAvnAXUekLysgAAAABJRU5ErkJggg==';

const M_LEFT = 40;
const M_TOP = 40;
const M_RIGHT = 40;
const M_BOTTOM = 70; // mayor para cinta + footer

function rowsRefTallaCantidad(references) {
  const rows = [];
  references.forEach(ref => {
    const sizes = ref.sizes || {};
    Object.keys(sizes)
      .sort((a, b) => Number(a) - Number(b))
      .forEach(size => {
        rows.push([
          { text: String(ref.name) },
          { text: String(ref.externalOrderIds), alignment: 'center' },
          { text: String(ref.orderIds), alignment: 'center' },
          { text: String(size), alignment: 'center' },
          { text: String(sizes[size]), alignment: 'center' }
        ]);
      });
  });
  return rows;
}

// ===== Sección por caja (media carta) =====
function sectionForBox(ctx, box) {
  // ===== 1) Header: Despacho + Logo (mismo row, márgenes compactos) =====
  const headerRow = {
    columns: [
      { width: 100, image: LOGO_BASE64, fit: [100, 36] },
      { width: '*', text: 'Despacho: ' + ctx.dispatchId, alignment: 'right', style: 'title' }
    ],
    margin: [0, 0, 0, 6]
  };

  // ===== 2) Remitente (IZQ) | Destinatario (DER) con label inline =====
  const partiesRow = {
    columns: [
      {
        width: '*',
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              { text: [{ text: 'Remitente: ', bold: true }, String(ctx.sender.name)] },
              { text: [{ text: 'Dirección: ', bold: true }, String(ctx.sender.address)] },
              { text: [{ text: 'Tel: ', bold: true }, String(ctx.sender.phone)] }
            ]
          }]]
        },
        layout: 'noBorders',
        margin: [0, 0, 8, 6]
      },
      {
        width: '*',
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              { text: [{ text: 'Destinatario: ', bold: true }, String(ctx.recipient.name)] },
              { text: [{ text: 'Dirección: ', bold: true }, String(ctx.recipient.address)] },
              { text: [{ text: 'Tel: ', bold: true }, String(ctx.recipient.phone)] }
            ]
          }]]
        },
        layout: 'noBorders',
        margin: [8, 0, 0, 6]
      }
    ],
    columnGap: 12
  };

  // ===== 3) Tabla única: [Ref | Talla | Cantidad] (con menos margen) =====
  const bodyRows = [
    [
      { text: 'Ref', style: 'th', alignment: 'left' },
      { text: 'Ord. Compra', style: 'th', alignment: 'center' },
      { text: 'Ord. Pedido', style: 'th', alignment: 'center' },
      { text: 'Talla', style: 'th', alignment: 'center' },
      { text: 'Cantidad', style: 'th', alignment: 'center' }
    ],
    ...rowsRefTallaCantidad(box.references)
  ];
  const tableBlock = {
    table: { widths: ['*', 80, 80, 60, 70], body: bodyRows },
    layout: 'lightHorizontalLines',
    margin: [0, 2, 0, 4]
  };

  return [headerRow, partiesRow, tableBlock];
}

// ===== DocDefinition (media carta) =====
function buildDoc(ctx) {
  const content = [];
  const boxes = ctx.boxes || [];
  const totalBoxes = ctx.totalBoxes ?? boxes.length;
  const totalUnits = ctx.totalUnits ?? boxes.reduce((sum, b) => sum + (b.unitsInPackage || 0), 0);

  // cada box = una página
  boxes.forEach((box, idx) => {
    content.push(...sectionForBox(ctx, box));
    if (idx !== boxes.length - 1) {
      content.push({ text: '', pageBreak: 'after' });
    }
  });

  // footer que se renderiza en la parte baja de cada página
  const footer = (currentPage, pageCount) => {
    // asumimos una página por caja: la caja correspondiente es currentPage - 1
    const box = boxes[currentPage - 1] || {};
    const unitsInBox = box.unitsInPackage ?? 0;
    const boxNo = box.boxNo ?? currentPage;

    return {
      columns: [
        { text: `Contenido: ${unitsInBox} de ${totalUnits} Pares`, alignment: 'left' },
        { text: `Paquete ${boxNo} de ${totalBoxes}`, alignment: 'right' }
      ],
      margin: [M_LEFT, 0, M_RIGHT, 8]
      // puedes aplicar estilo si quieres:
      // style: 'footer'
    };
  };

  return {
    // 13.7 cm × 21.4 cm (portrait)
    pageSize: { height: 388, width: 607 },
    // aumentar margen inferior para dejar espacio al footer
    pageMargins: [M_LEFT, M_TOP, M_RIGHT, M_BOTTOM],
    content,
    footer,
    styles: {
      title: { fontSize: 16, bold: true },
      label: { fontSize: 10, bold: true, color: '#333' },
      name: { fontSize: 12, bold: true },
      th: { fontSize: 11, bold: true },
      footer: { fontSize: 10 }
    },
    defaultStyle: { fontSize: 10, lineHeight: 1.15 }
  };
}

function groupItemsByBox(itemsData) {
  const items = {};
  itemsData.forEach(i => {
    const orderItemId = i.orderItemId;
    if (!items[orderItemId]) {
      items[orderItemId] = {
        name: `[${i.orderItem.shoe.reference}] ${i.orderItem.shoe.title}`,
        total: 0,
        sizes: [],
        orderIds: new Set(),
        externalOrderIds: new Set()
      };
    }

    // Sumar cantidad total
    items[orderItemId].total += i.quantity;

    // guardar order.id y order.externalId si existen
    const order = i.orderItem.order || {};
    if (order.id != null) items[orderItemId].orderIds.add(String(order.id));
    if (order.externalId != null) items[orderItemId].externalOrderIds.add(String(order.externalId));

    // Acumular tallas (sizes)
    i.sizes.filter(s => s.quantity).forEach(sizeItem => {
      const existingSize = items[orderItemId].sizes.find(s => s.size === sizeItem.size);
      if (existingSize) existingSize.quantity += sizeItem.quantity;
      else items[orderItemId].sizes.push({ ...sizeItem });
    });
  });

  // Convertir los Set de orderIds a arrays para salida
  Object.keys(items).forEach(k => {
    items[k].orderIds = Array.from(items[k].orderIds).join(', ');
    items[k].externalOrderIds = Array.from(items[k].externalOrderIds).join(', ');
  });

  return items;
}

function allocateGroupedItemsToBoxes(groupedItems, unitsPerPackage) {
  if (!Number.isFinite(unitsPerPackage) || unitsPerPackage <= 0) {
    throw new Error('unitsPerPackage debe ser un número entero mayor que 0');
  }

  const boxes = [];
  let currentBox = createEmptyBox(1, unitsPerPackage);

  function createEmptyBox(boxNo, capacity) {
    return {
      boxNo,
      capacity,           // capacidad de la caja (ej. 35)
      remaining: capacity,
      references: []
    };
  }

  function addToBox(box, itemName, sizeKey, qty, orderIds, externalOrderIds) {
    let ref = box.references.find(r => r.name === itemName);
    if (!ref) {
      ref = { name: itemName, sizes: {}, orderIds, externalOrderIds };
      box.references.push(ref);
    }
    ref.sizes[sizeKey] = (ref.sizes[sizeKey] || 0) + qty;
    box.remaining -= qty;
  }

  const orderItemIds = Object.keys(groupedItems);

  for (const id of orderItemIds) {
    const item = groupedItems[id];
    const itemName = item.name || `item-${id}`;
    const orderIds = item.orderIds || '-';
    const externalOrderIds = item.externalOrderIds || '-';

    let sizesArr = [];
    if (Array.isArray(item.sizes)) {
      sizesArr = item.sizes.map(s => ({ size: s.size, quantity: Number(s.quantity || 0) }));
    } else if (item.sizes && typeof item.sizes === 'object') {
      sizesArr = Object.keys(item.sizes).map(k => ({ size: k, quantity: Number(item.sizes[k] || 0) }));
    }

    sizesArr.sort((a, b) => Number(a.size) - Number(b.size));

    for (let s of sizesArr) {
      let qty = Number(s.quantity || 0);
      const sizeKey = String(s.size);

      while (qty > 0) {
        if (currentBox.remaining === 0) {
          // calculamos cuantos se usaron en la caja antes de enviarla
          const used = currentBox.capacity - currentBox.remaining;
          boxes.push({
            boxNo: currentBox.boxNo,
            unitsInPackage: used,    // <-- cantidad real en la caja
            capacity: currentBox.capacity,
            references: currentBox.references
          });
          currentBox = createEmptyBox(currentBox.boxNo + 1, unitsPerPackage);
        }

        const take = Math.min(qty, currentBox.remaining);
        addToBox(currentBox, itemName, sizeKey, take, orderIds, externalOrderIds);
        qty -= take;
      }
    }
  }

  // push última caja si tiene contenido
  if (currentBox.references.length > 0) {
    const used = currentBox.capacity - currentBox.remaining;
    boxes.push({
      boxNo: currentBox.boxNo,
      unitsInPackage: used,
      capacity: currentBox.capacity,
      references: currentBox.references
    });
  }

  return boxes;
}

function madShipmentToPdf(shipment) {
  let items = groupItemsByBox(shipment.items);
  let boxes = allocateGroupedItemsToBoxes(items, shipment.unitsPerPackage ?? 15);

  const mappedShipment = {
    dispatchId: `TRN-${shipment.id}`,
    totalBoxes: shipment.packagesTotal,
    totalUnits: shipment.totalItems,
    sender: {
      name: 'Botas Torino LTDA',
      address: 'Carrera 45 sur #114-92 Sector Aparco. Ibagué, Tolima. Colombia',
      phone: '+(57) 312 5819 781'
    },
    recipient: {                    // Destinatario (DER)
      name: shipment.account.title,
      address: `${shipment.locatable.address}. ${shipment.locatable.city.name}, ${shipment.locatable.province.name}. ${shipment.locatable.country.name}`,
      phone: shipment.account.contactItems
        .filter(i => [0, 1].includes(i.typeId))
        .map(i => i.value).join(' / ')
    },
    boxes
  };
  return mappedShipment;
}

export async function generateShipmentPdf(pdfmake, shipmentData, opts = {}) {
  const shipment = madShipmentToPdf(shipmentData);

  const {
    mode = 'open',
    filename = `despacho-${shipmentData.id}.pdf`,
    ...rest
  } = opts;

  const dd = buildDoc(shipment);

  const api = pdfmake.createPdf(dd);
  if (mode === 'download') return api.download(filename);
  if (mode === 'print') return api.print();
  return api.open();
}
