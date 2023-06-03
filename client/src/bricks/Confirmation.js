import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function Confirmation({title, message, confirmText, onConfirm, children}) {

    const handleClose = () => document.body.click();

    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
            handleClose();
        }
    }

    const popover = (
        <Popover id='popover-positioned-left'>
            <Popover.Header as="h3">{title}</Popover.Header>
            <Popover.Body>
                {message}
                <div className='d-flex flex-column gap-2 mt-3 w-100'>
                    <Button
                        variant='danger'
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>

                    <Button
                        variant='dark'
                        onClick={handleClose}
                    >
                        Zrušit
                    </Button>
                </div>
            </Popover.Body>
        </Popover>


    );

    return (
        <>
            <OverlayTrigger
                trigger="click"
                key="left"
                placement="left"
                overlay={popover}
                rootClose
            >
                {children}
            </OverlayTrigger>
        </>
    );
}