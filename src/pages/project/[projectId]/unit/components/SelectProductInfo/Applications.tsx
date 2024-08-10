// @mui
import { Container, Box } from '@mui/material';
// components
import ApplicationItem from './ApplicationItem';

const applications = [{ id: 1, items: 'Comercial' }];

// ----------------------------------------------------------------------
type SelectApplicationType = {
  onSelectItem: Function;
};

export default function SelectApplication(props: SelectApplicationType) {
  const { onSelectItem } = props;

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'grid',
          rowGap: 3,
          columnGap: 2,
          paddingTop: 5,
          alignItems: 'center',
          gridTemplateColumns: {
            xs: `repeat(${applications.length}, 1fr)`,
          },
        }}
      >
        {applications.map((ele) => (
          <ApplicationItem
            key={ele.id}
            label={ele.items}
            onSelectItem={() => {
              onSelectItem(ele.items, ele.id);
            }}
          />
        ))}
      </Box>
    </Container>
  );
}
