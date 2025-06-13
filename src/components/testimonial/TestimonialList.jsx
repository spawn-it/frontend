import { Box } from '@mui/material';
import ScrollableSection from '../common/ScrollableSection';
import Testimonial from './Testimonial';
import Container from '@mui/material/Container';
import { useTheme } from '../../context/ThemeProvider';

export default function TestimonialList({ testimonials }) {
  const { colors } = useTheme();

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: colors.background,
        transition: 'background-color 0.3s ease',
      }}
      id="testimonials"
    >
      <Container maxWidth="lg">
        <ScrollableSection
          title="What Our Customers Say"
          subtitle="Join thousands of satisfied users"
          gap={4}
          containerSx={{ mb: 0 }}
          headerSx={{ mb: 6 }}
        >
          {testimonials.map((t, i) => (
            <Testimonial t={t} key={i} />
          ))}
        </ScrollableSection>
      </Container>
    </Box>
  );
}
