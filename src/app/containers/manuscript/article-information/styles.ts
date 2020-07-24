import { makeStyles } from '@material-ui/core/styles';

export const useArticleInformationStyles = makeStyles((theme) => ({
  sectionContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  infoSection: {
    flex: 1,
    lineHeight: '24px',
    paddingTop: theme.spacing(0.5)
  },
  editButton: {
    flexGrow: 0,
    padding: 6
  }
}));
