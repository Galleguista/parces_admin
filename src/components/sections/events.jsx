import React from 'react';
import { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Box
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const initialEvents = [
  {
    id: 1,
    title: 'Organic Farming Workshop',
    description: 'A workshop on organic farming techniques.',
    start: new Date(2023, 5, 10, 10, 0), // June 10, 2023, 10:00 AM
    end: new Date(2023, 5, 10, 12, 0), // June 10, 2023, 12:00 PM
  },
  {
    id: 2,
    title: 'Urban Gardening Meetup',
    description: 'Meetup for urban gardening enthusiasts.',
    start: new Date(2023, 5, 15, 14, 0), // June 15, 2023, 2:00 PM
    end: new Date(2023, 5, 15, 16, 0), // June 15, 2023, 4:00 PM
  },
  {
    id: 3,
    title: 'Sustainable Agriculture Conference',
    description: 'Conference on sustainable agricultural practices.',
    start: new Date(2023, 5, 20, 9, 0), // June 20, 2023, 9:00 AM
    end: new Date(2023, 5, 20, 17, 0), // June 20, 2023, 5:00 PM
  },
];

const EventsSection = () => {
  const [events] = useState(initialEvents);

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Events</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Upcoming Events</Typography>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} alignItems="flex-start">
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {event.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="textSecondary">
                            {moment(event.start).format('MMMM Do YYYY, h:mm a')}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Event Calendar</Typography>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventsSection;
