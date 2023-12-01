function Jumbotron(props) {

    return (
        <div id={props.id}
             className={`jumbotron ${props.theme}-theme ${typeof props.img === 'undefined' ? '' : ' with-img'}`}>
            <div className="container my-3 my-lg-4 my-xl-5">
                {typeof props.img === 'undefined' ? '' :
                    <style jsx='true'>{`
                      #${props.id}.jumbotron .main-box {
                        background-image: url("${props.img.src}")
                      }
                    `}</style>
                }
                {typeof props.imgForNarrowerVP === 'undefined' ? '' :
                    <style jsx='true'>{`
                      @media (max-width: 991.98px) {
                        #${props.id}.jumbotron .main-box {
                          background-image: url("${props.imgForNarrowerVP.src}")
                        }
                      }
                    `}</style>
                }
                <div
                    className={
                        `main-box rounded-4 p-2 p-xs-3 p-md-4 p-xl-5 bg-${props.theme} text-` + (props.theme === 'dark' ? 'light' : 'dark')
                    }
                >
                    <div className={"text-n-actions"}>
                        <h2>
                            {props.title}
                        </h2>
                        {typeof props.imgForNarrowestVP === 'undefined' ? '' :
                            <>
                                <div
                                    className="img-for-narrowest-vp"
                                    style={{paddingBottom: props.imgForNarrowestVP.hwPercent + '%'}}
                                >
                                    <img src={props.imgForNarrowestVP.src} alt={props.imgForNarrowestVP.alt}/>
                                </div>
                            </>
                        }
                        <div className="body">
                            <p>{props.description}</p>
                        </div>
                        {props.actions ? (
                            <div className="actions">
                                {props.actions}
                            </div>
                        ) : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jumbotron;
