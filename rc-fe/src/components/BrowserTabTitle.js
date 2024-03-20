import React, {useEffect} from "react";

const BrowserTabTitle = ({subtitle}) => {
    useEffect(() => {
        if (subtitle && subtitle !== '') {
            const prevTitle = document.title;
            document.title = subtitle + ' - ' + process.env.REACT_APP_SITE_NAME;
            return () => {
                document.title = prevTitle;
            };
        }
    });
    return <></>;
};

export default BrowserTabTitle;
