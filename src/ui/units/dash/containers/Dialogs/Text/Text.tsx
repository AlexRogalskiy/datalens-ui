import React from 'react';

import {Dialog} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import {ResolveThunks, connect} from 'react-redux';
import {DatalensGlobalState} from 'ui';

import {TextEditor} from '../../../../../components/TextEditor/TextEditor';
import {DIALOG_TYPE} from '../../../containers/Dialogs/constants';
import {closeDialog} from '../../../store/actions/dash';
import {setItemData} from '../../../store/actions/dashTyped';
import {getOpenedItemData} from '../../../store/selectors/dash';
import {selectIsDialogVisible} from '../../../store/selectors/dashTypedSelectors';

import './Text.scss';

const b = block('dialog-text');

const i18n = I18n.keyset('dash.text-dialog.edit');

export interface OwnProps {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof mapDispatchToProps>;

interface State {
    text?: string;
    prevVisible?: boolean;
}

export type TextProps = OwnProps & StateProps & DispatchProps;

class Text extends React.PureComponent<TextProps, State> {
    static defaultProps = {
        data: {
            text: '',
        },
    };

    static getDerivedStateFromProps(nextProps: TextProps, prevState: State) {
        if (nextProps.visible === prevState.prevVisible) {
            return null;
        }

        return {
            prevVisible: nextProps.visible,
            text: nextProps.data.text,
        };
    }

    state: State = {};

    render() {
        const {id, visible} = this.props;
        const {text} = this.state;

        return (
            <Dialog
                open={visible}
                onClose={this.props.closeDialog}
                disableOutsideClick={true}
                disableFocusTrap={true}
            >
                <Dialog.Header caption={i18n('label_text')} />
                <Dialog.Body className={b()}>
                    <TextEditor autofocus onTextUpdate={this.onTextUpdate} text={text} />
                </Dialog.Body>
                <Dialog.Footer
                    onClickButtonApply={this.onApply}
                    textButtonApply={id ? i18n('button_save') : i18n('button_add')}
                    onClickButtonCancel={this.props.closeDialog}
                    textButtonCancel={i18n('button_cancel')}
                />
            </Dialog>
        );
    }

    onTextUpdate = (text: string) => this.setState({text});

    onApply = () => {
        const {text} = this.state;

        this.props.setItemData({data: {text}});
        this.props.closeDialog();
    };
}

const mapStateToProps = (state: DatalensGlobalState) => ({
    id: state.dash.openedItemId,
    data: getOpenedItemData(state),
    visible: selectIsDialogVisible(state, DIALOG_TYPE.TEXT),
});

const mapDispatchToProps = {
    closeDialog,
    setItemData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Text);
