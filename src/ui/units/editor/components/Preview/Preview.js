import React from 'react';

import block from 'bem-cn-lite';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';

import {ChartWrapper} from '../../../../components/Widgets/Chart/ChartWidgetWithProvider';
import {URL_QUERY} from '../../../../constants';
import {UrlSearch} from '../../../../utils';
import {Status} from '../../constants/common';

import './Preview.scss';

const b = block('chart-preview');

const Preview = ({chartData, onLoadData, queryParams, widgetRef}) => {
    const onLoad = (result) => {
        const status = result.status === Status.Success ? Status.Success : Status.Failed;
        onLoadData({data: result.data, status});
    };

    return (
        <div className={b()} data-qa="chart-preview">
            <ChartWrapper
                usageType="chart"
                id={chartData.id}
                config={chartData.editMode}
                params={queryParams}
                onChartLoad={onLoad}
                forwardedRef={widgetRef}
            />
        </div>
    );
};

Preview.propTypes = {
    chartData: PropTypes.shape({
        id: PropTypes.string,
        editMode: PropTypes.shape({
            type: PropTypes.string.isRequired,
            data: PropTypes.object.isRequired,
        }).isRequired,
    }),
    onLoadData: PropTypes.func.isRequired,
    queryParams: PropTypes.object,
    widgetRef: PropTypes.object,
};

const MemoPreview = React.memo(Preview);

function PreviewWrap(props) {
    const {chartData} = props;
    const widgetRef = React.useRef(null);
    const {search} = useLocation();
    const {paneSize, ...restProps} = props;
    const queryParams = React.useMemo(() => {
        return new UrlSearch(search).delete(Object.values(URL_QUERY)).toObject();
    }, [search]);

    React.useEffect(() => {
        if (widgetRef.current && typeof widgetRef.current.reflow === 'function') {
            widgetRef.current.reflow();
        }
    }, [paneSize]);

    if (chartData === null) {
        return null;
    }

    return (
        <MemoPreview
            key={chartData.updateKey}
            {...restProps}
            queryParams={queryParams}
            widgetRef={widgetRef}
        />
    );
}

PreviewWrap.propTypes = {
    paneSize: PropTypes.number,
    chartData: PropTypes.shape({
        updateKey: PropTypes.number.isRequired,
    }),
};

export default PreviewWrap;
