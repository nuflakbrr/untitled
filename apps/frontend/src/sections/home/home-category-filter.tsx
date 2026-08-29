import type { PublicCategory } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function CategoryFilter({ categories }: { categories: PublicCategory[] }) {
  return (
    <Box
      component="section"
      sx={{
        position: 'sticky',
        top: { xs: '72px', md: '84px' },
        zIndex: 'var(--layout-header-zIndex)',
        borderBlock: '1px solid',
        borderColor: 'divider',
        py: 2.25,
        bgcolor: 'background.paper',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container>
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          <Chip
            component={RouterLink}
            href={paths.event.root}
            label="Semua Event"
            color="primary"
            clickable
            sx={{ flexShrink: 0, height: 44, borderRadius: 99, fontWeight: 700 }}
          />
          {categories.map((category) => (
            <Chip
              component={RouterLink}
              href={`${paths.event.root}?category=${encodeURIComponent(category.slug)}`}
              key={category.id}
              label={category.name}
              variant="outlined"
              clickable
              sx={{ flexShrink: 0, height: 44, borderRadius: 99, fontWeight: 700 }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
