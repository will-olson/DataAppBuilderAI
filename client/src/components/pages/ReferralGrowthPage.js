// ReferralGrowthPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { fetchReferralInsights } from '../../services/api';

const ReferralGrowthPage = () => {
    const [referralData, setReferralData] = useState({
      totalReferrals: 0,
      referralSources: [],
      referralConversionRates: []
    });
  
    useEffect(() => {
      const fetchReferralData = async () => {
        try {
          const data = await fetchReferralInsights();
          setReferralData(data);
        } catch (error) {
          console.error('Referral data fetch error', error);
        }
      };
  
      fetchReferralData();
    }, []);
  
    return (
      <Container>
        <Typography variant="h4">Referral & Growth Insights</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Referral Sources</Typography>
                {referralData.referralSources.map(source => (
                  <Typography>
                    {source.name}: {source.count} referrals
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Conversion Rates</Typography>
                {referralData.referralConversionRates.map(rate => (
                  <Typography>
                    {rate.source}: {(rate.conversionRate * 100).toFixed(2)}%
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

  export default ReferralGrowthPage