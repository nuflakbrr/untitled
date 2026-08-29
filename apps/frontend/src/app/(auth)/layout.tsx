import Box from '@mui/material/Box';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background:
          'linear-gradient(145deg, var(--palette-background-default) 35%, var(--palette-primary-lighter) 160%)',
      }}
    >
      {children}
    </Box>
  );
}
