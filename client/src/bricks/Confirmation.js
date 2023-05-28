import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function Confirmation({title, message, confirmText, onConfirm, children}) {
    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
        }
    }

    const handleClose = () => document.body.click();

    const popover = (
        <Popover id='popover-positioned-bottom'>
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
                        variant='light'
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
                key="bottom"
                placement="bottom"
                overlay={popover}
                rootClose
            >
                {children}
            </OverlayTrigger>
        </>
    );
}