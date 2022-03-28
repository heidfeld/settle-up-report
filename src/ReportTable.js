import { useEffect, useState } from 'react';
import content from './transactions.csv';

import './ReportTable.css';

const toValue = (item) => {
    return item.replaceAll('"', '');
}

const parseData = (data) => {

    if (data) {
        const rows = data.split('\n');
        const onlyData = rows.slice(2);
        const uniqueWhom = new Set();
        const rowsData = onlyData.map(row => {
            const cells = row.split(',');
            const whom = cells[3].replaceAll('"', '').split(';');
            const amounts = cells[4].replaceAll('"', '').split(';');
            whom.forEach(item => uniqueWhom.add(item));
            return {
                title: toValue(cells[5]),
                whom,
                amounts,
                amount: toValue(cells[1]),
                who: toValue(cells[0]),
                currency: toValue(cells[2])
            };
        });
        return {
            rowsData,
            uniqueWhom
        }
    }
}

const ReportTable = () => {


    const [data, setData] = useState(null);
    const [parsedData, setParsedData] = useState(null);

    useEffect(() => {
        fetch(content)
        .then(res => res.text())
        .then(text => setData(text));
    }, []);

    

    useEffect(() => {
        const parsed = parseData(data);
        setParsedData(parsed);
    }, [data]);



    const renderRow = (cells) => {
        return <div className='div-table-row'>{cells}</div>
    };

    const renderCell = (value, isStatic) => {
        if (isStatic) {
            return <div className="div-table-col div-table-col-static">{value}</div>;
        }
        return <div className="div-table-col">{value}</div>;
    };

    if (parsedData) {
        const {uniqueWhom, rowsData} = parsedData;

        const header = ['Wydatek', 'Kto Płacił', 'Ile [PLN]', ...uniqueWhom].map(value => renderCell(value));

        const allRows = rowsData.map(row => {

            const peopleCells = [...uniqueWhom].map(whom => {
                const rowWhom = row.whom;
                const foundIndex = rowWhom.findIndex((rowWhomItem) => rowWhomItem === whom);
                const val = foundIndex !== -1 ? row.amounts[foundIndex] : '';
                return renderCell(val);
            });

            const cells = [
                renderCell(row.title, true),
                renderCell(row.who, true),
                renderCell(row.amount, true),
                ...peopleCells
            ];
            return renderRow(cells);
        });

        return (
        <div className='div-table'>
            {renderRow(header)}
            {allRows}
        </div>
        );
    };

    return <div>Waiting for data...</div>

}

export default ReportTable;
