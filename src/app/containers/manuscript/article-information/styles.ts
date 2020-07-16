import { makeStyles } from '@material-ui/core/styles';

export const useArticleInformationStyles = makeStyles((theme) => ({
  sectionContainer: {
    display: 'flex'
  },
  infoSection: {
    flex: 1,
    paddingTop: theme.spacing(1)
  },
  editButton: {
    flexGrow: 0,
    padding: 6
  }
}));
