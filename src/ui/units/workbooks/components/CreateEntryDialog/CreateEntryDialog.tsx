import React from 'react';

import {EntryDialogName, EntryDialogResolveStatus, EntryDialogues} from 'components/EntryDialogues';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {registry} from '../../../../registry';
import {CreateEntryActionType} from '../../constants';
import {resetCreateWorkbookEntryType} from '../../store/actions';
import {selectCreateWorkbookEntryType, selectWorkbookId} from '../../store/selectors';

export const CreateEntryDialog = React.memo(() => {
    const entryDialoguesRef = React.useRef<EntryDialogues>(null);

    const history = useHistory();

    const dispatch = useDispatch();
    const type = useSelector(selectCreateWorkbookEntryType);
    const workbookId = useSelector(selectWorkbookId);

    const {getWorkbookDashboardEntryUrl} = registry.workbooks.functions.getAll();

    React.useEffect(() => {
        async function create() {
            if (type && workbookId) {
                dispatch(resetCreateWorkbookEntryType());

                switch (type) {
                    case CreateEntryActionType.Dashboard: {
                        const response = await entryDialoguesRef.current?.open({
                            dialog: EntryDialogName.CreateDashboard,
                            dialogProps: {
                                workbookId,
                            },
                        });
                        if (response?.status === EntryDialogResolveStatus.Success) {
                            const url = getWorkbookDashboardEntryUrl(response);
                            history.push(url);
                        }
                        break;
                    }
                    case CreateEntryActionType.Dataset: {
                        history.push(`/workbooks/${workbookId}/datasets/new`);
                        break;
                    }
                    case CreateEntryActionType.Connection: {
                        history.push(`/workbooks/${workbookId}/connections/new`);
                        break;
                    }
                    case CreateEntryActionType.QL: {
                        history.push(`/workbooks/${workbookId}/ql`);
                        break;
                    }
                    case CreateEntryActionType.Wizard: {
                        history.push(`/workbooks/${workbookId}/wizard`);
                        break;
                    }
                }
            }
        }

        create();
    }, [dispatch, getWorkbookDashboardEntryUrl, history, type, workbookId]);

    return <EntryDialogues ref={entryDialoguesRef} />;
});

CreateEntryDialog.displayName = 'CreateEntryDialog';
