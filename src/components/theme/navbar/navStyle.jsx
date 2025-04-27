const Style = (scrolled = false) => ({
    appBar: {
         
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
            boxShadow: scrolled ? '0px 2px 5px rgba(0,0,0,0.1)' : 'none',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',

            backdropFilter: 'blur(8px)',
            boxShadow: 'none',
            color: '#fff',
            height:'4rem',
            left: '50%',

            transform: 'translate(-50%, 0%)',
       
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2rem',
        },
        logo: {
            width: '92px',
            height: '92px',
            transition: '0.3s ease',
            '&:hover': {
                cursor: 'pointer',
                transform: 'scale(1.1)',
            },
        },
        drawer: {
            width: '100%',
            textAlign: 'center',
        },
        logoImg: {
            maxHeight: '100%',
            maxWidth: '100%',
        },
        navlist: {
            color: "black",
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '2rem',
            '& > *': {
                cursor: 'pointer',
                transition: '0.2s ease',
                '&:hover': {
                    transform: 'scale(1.1)',
                },
            },
        },
    });
export default Style;

