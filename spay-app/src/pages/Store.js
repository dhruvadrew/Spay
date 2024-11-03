import React, { useState } from 'react';
import { Box, Card, Typography, CardActions, CardContent, Button, Modal } from '@mui/material';
import { Link } from 'react-router-dom'


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Store = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ width: '93vw', margin: '', margin:'2em', padding: '2em', bgcolor: '#181818', color: '#ffffff', marginTop: '6em'}}>
      <Typography variant="h6" component="div" gutterBottom style={{ color: '#999' }}>
        Just for testing...
      </Typography>
      <Typography variant="h4" component="div" gutterBottom style={{ color: '#ffffff' }}>
        <b>Purchase From Store</b>
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: '2em', paddingBottom: '2em', gap: '4em', justifyContent: 'center' }}>
        {[...Array(3)].map((_, index) => (
          <Card variant="outlined" key={index} sx={{ width: '22.5%', bgcolor: '#333', color: '#ffffff' }}>
            <CardContent>
              <Typography gutterBottom sx={{ color: '#bbbbbb', fontSize: 14 }}>
                Essentials
              </Typography>
              <Typography variant="h5" component="div">
                <b>Sofa</b>
              </Typography>
              <Typography variant="body2" component="div">
                <img src="https://placehold.co/600x400" alt="Sofa" style={{ width: '100%', marginTop: '1em', marginBottom: '1em' }} />
              </Typography>
              <Typography variant="body2">
                A cozy, three-seater sofa with soft cushions, a sturdy frame, and plush fabric upholstery, perfect for relaxing or entertaining in any living space.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" variant='outlined' onClick={handleOpen} style={{color: '#ffffff', borderColor: '#ffffff', marginLeft:'10px', marginBottom:'10px'}}>
                Buy now
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#1e1e1e',
            color: '#ffffff',
            border: '2px solid #333',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#ffffff' }}>
            Confirm Payment
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" sx={{ width: '90%', color: '#ffffff', borderColor: '#ffffff' }}>Paypal</Button>
              <Button variant="outlined" sx={{ width: '90%', color: '#ffffff', borderColor: '#ffffff' }}>Credit Card</Button>
              <Link style={{ width: '100%'}} to='/result'>
              <Button variant="outlined" sx={{ width: '90%', color: '#ffffff', borderColor: '#ffffff' }}>SPay</Button>
              </Link>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Store;
